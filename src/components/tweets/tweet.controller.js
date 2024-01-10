import { pick } from "lodash"
import { Tweets } from "."
import ErrorHandler from "../../service/ErrorHandler"
import { Profile } from "../profile"

const TwitterController ={
    createTwitter:async function(req,res,next){
        try {
            const {_id:authUserId} = req.user
            const request          = pick(req.body,['text','replyTo'])
            request.author         =  authUserId
            if(request.replyTo && !Tweets.exists({_id:request.replyTo})){
                return next(ErrorHandler.notFound('Tweet Not Found'))
            } 

            const tweet = await Tweets.create(request)

            if(request.replyTo){
               const originalTweet= await Tweets.findById(request.replyTo)
               originalTweet.updateReplyCount()    
            }
            res.data(tweet)
     
        } catch (error) {
            next(error)
        }
         
    },
    getTwittes:async function(req,res,next){
        try {
            const options = pick(req.body,['sortBy','limit','page'])
            const filters = pick(req.body,['author','retweets','likes','replyTo'])
            const data    = await Tweets.paginate(options,filters)
            return res.data(data)
        } catch (error) {
            next(error)
        }   
    },
    likesTwitter: async function (req,res,next){
        try {
            const {tweetId}     = req.params
            const {_id:userId}  = req.user
            const isValidTweet  = await Tweets.findById(tweetId)
            if(!isValidTweet)
            	return next(ErrorHandler.notFound('Tweet not found!!'))
                
            const isValidProfiles = await Profile.findOne({user:userId})
            // if(!isValidProfiles)
            //     return next(ErrorHandler.notFound('Profile not found!!'))
                
            if( isValidProfiles.isLikes(tweetId))
                return next(ErrorHandler.badRequest('you already liked this tweet!!')) 

            await Promise.all([isValidProfiles.like(tweetId),isValidTweet.like(userId)])
            
            return res.data(isValidTweet)


        } catch (error) {
            next(error)
        }
    },
    unlikeTweet:async function(req,res,next){
        try {
            const {tweetId} = req.params
            const {_id:userId} = req.user
            const isValidTweet =  await Tweets.findById(tweetId)
            if(!isValidTweet){
                return next(ErrorHandler.notFound('Tweet Not found!!!'))
            }
            
            const isValidProfiles =  await Profile.findOne({user:userId})
            
            if(! isValidProfiles.isLikes(tweetId)) return next(ErrorHandler.badRequest('you did not like this tweet!!'))
             
            await Promise.all([isValidProfiles.unlike(tweetId), isValidTweet.unlike(userId)])
            res.data(isValidTweet)
        } catch (error) {
            next(error)
        }
    },
    getSingleTweet:async function(req,res,next){
        try {
            const {tweetId} = req.params
            const isValidTweet = await Tweets.findById(tweetId).select('-__v -updatedAt')
            if(!isValidTweet)
                return next(ErrorHandler.notFound('Tweet not found!!')) 

           return res.data(await isValidTweet.populate('author',['name','username','avatar']))

        } catch (error) {
            next(error)
        }
    },
    updateTweet: async function(req,res,next){
        const {tweetId}    = req.params
        const {_id:userId} = req.user
        const text         = pick(req.body,['text'])
        const isValidTweet = await Tweets.findById(tweetId)
        if(!isValidTweet)
            return next(ErrorHandler.notFound('Invalid tweet!!'))
        
        if(!(isValidTweet.author.equals(userId)) && req.user.role !='admin')
            return next(ErrorHandler.unauthorized('you can not update someone tweets!!'))    

        Object.assign(isValidTweet,text)
        await isValidTweet.save()
        return res.data(isValidTweet)
    },
    deleteTweet: async function(req,res,next){
        const {tweetId}    = req.params
        const {_id:userId} = req.user
        const text         = pick(req.body,['text'])
        const isValidTweet = await Tweets.findById(tweetId)
        if(!isValidTweet)
            return next(ErrorHandler.notFound('Invalid tweet!!'))
        
        if(!(isValidTweet.author.equals(userId)) && req.user.role !='admin')
            return next(ErrorHandler.unauthorized('you can not update someone tweets!!'))    
        
            
        await isValidTweet.remove() 
 
        if(isValidTweet.replyTo){
            const originalTweet= await Tweets.findById(isValidTweet.replyTo)
            originalTweet.updateReplyCount()   
        } 
        return res.data(isValidTweet)

    },

    // get latest tweet of following user and self tweet
    getFeedTweets : async function(req,res,next){
        const options= pick(req.query,['limit','page'])
        const {_id:userId} = req.user
        const profileData = await Profile.findOne({user:userId})
        
        options.populate={
            path:'author',
            select:['name','username','avatar']
        }
        options.sortBy='createdAt:desc'

        const query = 
        {
            $and:[
                {
                    replyTo:null
                },
                {
                    $or:[
                        {author:userId},
                        {author:{$in:profileData.following}}
                    ]
                }
            ]
        }

        return res.data(await Tweets.paginate(options,query))
    }

}

export default TwitterController