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
    }


}

export default TweetValidation