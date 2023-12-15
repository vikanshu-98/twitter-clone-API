import passport from 'passport'
import ErrorHandler from '../service/ErrorHandler'
import roles from '../config/roles'

const verifyCallback =  (req,resolve,reject,rights)=>(error,user,info)=>{
    if(error || info || !user)
        return reject(ErrorHandler.unauthenticated())

    req.user =user;
     
    if(rights.length){
        const userRights = roles.roleRight.get(user.role)
        const hasRights  = rights.every((elem)=>userRights.includes(elem))
        if(!hasRights && req.params.userId!==user.id)
            return reject(ErrorHandler.unauthorized())
    }
    resolve()
}

const auth =(...rights)=>(req,res,next)=>{
    return new Promise((resolve,reject)=>{
        passport.authenticate('jwt',{session:false},verifyCallback(req,resolve,reject,rights))(req,res,next)
    }).then(()=>next()).catch((err)=>next(err))
    
}

export default auth