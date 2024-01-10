import Joi from 'joi';
import  { pick } from 'lodash'

const validate=(schema)=>(req,res,next)=>{ 
    const validSchemma=  pick(schema,['params','query','body'])
    const obj = pick(req,Object.keys(validSchemma)) 
    const {error,value}=Joi.compile(validSchemma).prefs({errors:{label:'key'}}).validate(obj)
    if(error){
        // console.log(error)
        next(error)

    }
    Object.assign(req,value)
    next()

}

export default validate
