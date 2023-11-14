import Joi from 'joi'
import customValidation from '../../utils/customValidation'
import roles from '../../config/roles'

const getUser = {
    params:Joi.object().keys({
        userId:Joi.string().required().custom(customValidation.ObjectId)
    })
}

const createUser = {
    body:Joi.object().keys({
        name:Joi.string().required(),
        username:Joi.string().required().min(3).max(30),
        email:Joi.string().required().email(),
        password:Joi.string().required().custom(customValidation.password),
        role: Joi.string()
        .required().valid(...roles.roles),
        avatar:Joi.string().required().custom(customValidation.url).max(255)
    })
}

const updateUser ={
    params : Joi.object().keys({
        userId:Joi.string().required().custom(customValidation.ObjectId)
    }),
    body:Joi.object().keys({
        name:Joi.string().required(),
        username:Joi.string().required().min(3).max(30),
        email:Joi.string().required().email(),
        password:Joi.string().required().custom(customValidation.password),
        role:Joi.string().required().valid(...roles.roles),
        avatar:Joi.string().required().custom(customValidation.url).max(255)
    })
}

export default {
    getUser,createUser,
    updateUser
}