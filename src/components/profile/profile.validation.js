import Joi from 'joi'
import customValidation from '../../utils/customValidation'


const profileValidation={
    ProfileRoutes:{
        params:Joi.object().keys({
            userId:Joi.string().required().custom(customValidation.ObjectId)
        })
    },
    getProfilesValidation:{
        query:Joi.object().keys({
            limit:Joi.number().integer(),
            page:Joi.number().integer(),
            likes:Joi.string().custom(customValidation.ObjectId),
            retweets:Joi.string().custom(customValidation.ObjectId),
            followers:Joi.string().custom(customValidation.ObjectId),
            following:Joi.string().custom(customValidation.ObjectId),
            sortBy:Joi.string(),
        })
    },
    updateProfile:{
        query:Joi.object().keys({
            userId:Joi.string().custom(customValidation.ObjectId)
        }),
        body:Joi.object().keys({
            bio:Joi.string().max(255).allow(''),
            location:Joi.string().max(255).allow(''),
            website:Joi.string().custom(customValidation.url).max(255).allow(''),
            birthday:Joi.date().allow(''),
            backgroundImage:Joi.string().custom(customValidation.url).max(255).allow('')
        }).min(1)
    }
}
 
export default profileValidation