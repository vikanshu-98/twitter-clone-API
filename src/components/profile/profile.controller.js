import { Profile } from "." 
import ErrorHandler from "../../service/ErrorHandler" 
import { filter, pick } from "lodash"
import { Users } from "../users/index";
const ProfileController ={
    async getProfile(req,res,next){
        try{
            const {userId} = req.params
            const profilesData = await Profile.findOne({user:userId}).populate('user',['name','username','avatar'])
            if(!profilesData)
                next(ErrorHandler.notFound('profile not found'))
            return res.data(profilesData)
        }catch(err){
            next(err)
        }
    },
    async getProfiles(req,res,next){
        try{
            const options = pick(req.query,['limit','page','sortBy'])
            const filters =  pick(req.query,['following','followers','likes','retweets'])
            if(filters.followers && !(await Users.exists({_id:filters.followers})))
                next(ErrorHandler.notFound('user does not exists!!!'))

            if(filters.following && !(await Users.exists({_id:filters.following})))
                next(ErrorHandler.notFound('user does not exists!!!'))
            
            // if(filters.likes && Users.exists({_id:filters.following}))
            //     next(ErrorHandler.notFound('user does not exists!!!'))
            options.populate = {
                path: 'user',
                select: ['name', 'username', 'avatar'],
            }; 
            const result=await Profile.paginate(options,filters)
            res.data(result);
        }catch(err){
            next(err)
        }
    },

    async followProfile(req,res,next){
        try {
            const { userId } = req.params;
            const {_id:loginUserId}= req.user 
            if(userId===loginUserId.toString())
                next(ErrorHandler.badRequest('you can not follow own profile!!'))   
            
            const [AuthUserProfile,profileToFollow] = await Promise.all([
                Profile.find({user:loginUserId}),
                Profile.find({user:userId})
            ])
            console.log(AuthUserProfile[0].isFollow(userId));
            console.log(profileToFollow);
            if(!profileToFollow)
                next(ErrorHandler.notFound('profile does not exists!!!'))

            if(AuthUserProfile[0].isFollow(userId) || profileToFollow[0].isFollower(loginUserId))
                next(ErrorHandler.badRequest('you already follow that profile !!'))   

            profileToFollow[0].followers.push(loginUserId)
            const[updatedAuthProfileData] = await Promise.all([AuthUserProfile[0].follow(userId),profileToFollow[0].save()])
            return res.data(updatedAuthProfileData)

        } catch (error) {
            next(error)   
        }
    }
}

export default ProfileController