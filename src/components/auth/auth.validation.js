import Joi from 'joi' ;
import  customValidation from '../../utils/customValidation'

const register ={
    body:Joi.object().keys({
        name:Joi.string().required(),
        username:Joi.string().required().min(3).max(30),
        email:Joi.string().required().email(),
        password:Joi.string().required().custom(customValidation.password)
    })
};
const login ={
    body:Joi.object().keys({ 
        username:Joi.string().required(), 
        password:Joi.string().required()
    })
};

const refreshTokens ={
    body:Joi.object().keys({ 
        refreshToken:Joi.string().required()
    })
};


export default {register,login,refreshTokens}