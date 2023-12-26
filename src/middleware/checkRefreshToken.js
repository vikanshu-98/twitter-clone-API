import { BlackListedToken } from "../components/blackListToken";
import { refreshTokens } from "../components/refreshToken";
import { Users } from "../components/users";
import config from "../config";
import ErrorHandler from "../service/ErrorHandler";
import auth from "../utils/auth";

const checkRefreshToken=async (req,res,next)=>{
    const {refreshToken}= req.body
    const {id,role} = auth.verifyToken(refreshToken,config.jwt.refreshToken); //first check token is valid
    const isBlackListed = await BlackListedToken.findOne({$and:[{token:refreshToken},{user:id}]}) // check kra ke blacklisted toh nahi h nah
    if(isBlackListed)
        return next(ErrorHandler.unauthorized('Invalid refresh token because this token is blacklisted'))
    
    const isPresent = await refreshTokens.findOne({$and:[{token:refreshToken},{user:id}]}); // chk kra ke refresh token table toh present h nah
    if(!isPresent)
        return next(ErrorHandler.unauthorized('Invalid refresh token!!'))

    const user  = await Users.findOne({_id:id})
    if(!user)
        return next(ErrorHandler.unauthorized('Invalid refresh token!!'))

    req.user=user

    next()
}

export default checkRefreshToken