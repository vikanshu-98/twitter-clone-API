import {ValidationError} from 'joi'
import config from '../config' 
import  logger from '../config/logger'
import ErrorHandler from '../service/ErrorHandler'

const handleNotFound =(req,res,next)=>{
 
    next(ErrorHandler.notFound())

}

const handleError=(err,req,res,next)=>{

    if(res.headerSent){
        next(err)
    }else{
        if(config.debugMode.toLowerCase()=='true')
            logger.error(err)
    }
    console.log(err.status);

    let statusCode =err.statusCode||500;
    let data={
        message:err.message||'Internal Server Error',
        ...(config.debugMode.toLowerCase()=='true' && {originalError:err.stack})
    }
    if(err instanceof ErrorHandler){
        statusCode=err.status;
        data={
            message:err.message,
            status:statusCode
        } 
    } 
    if(err instanceof ValidationError){
        statusCode=422;
        data={
            message:err.message,
            status:statusCode
        }
    }
    return res.status(statusCode).json({error:{data}})
}


export default {
handleNotFound,handleError
}