import Joi from "joi";
import customValidation from "../../utils/customValidation";

const TweetValidation={
    createTwitter:{
        body:Joi.object().keys({ 
            text:Joi.string().min(1).max(280),
            replyTo:Joi.string().custom(customValidation.ObjectId) 
        })
    },
    getTweets:{
        query:Joi.object().keys({
            limit:Joi.number().integer(),
            page:Joi.number().integer(),
            sortBy:Joi.string(),
            author:Joi.string().custom(customValidation.ObjectId),
            likes:Joi.string().custom(customValidation.ObjectId),
            replyTo:Joi.string().custom(customValidation.ObjectId),
            retweets:Joi.string().custom(customValidation.ObjectId)
        })
          
    },
    likeValidation:{
        query:Joi.object().keys({
            tweetId:Joi.string().custom(customValidation.ObjectId)
        })
    },
    updateTweet:{
        query:Joi.object().keys({
            tweetId:Joi.string().custom(customValidation.ObjectId)
        }),
        body:Joi.object().keys({
            text:Joi.string().required().min(1).max(288)
        })
    },

    getFeedTweets:{
        query:Joi.object().keys({
            limit:Joi.number().integer(),
            page:Joi.number().integer()
        })
 
    }


}

export default TweetValidation