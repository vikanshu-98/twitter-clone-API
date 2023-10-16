import { pick } from "lodash" 
import { Users } from "../users"
import ErrorHandler from "../../service/ErrorHandler"
 
import config from "../../config"
import { Profile } from "../profile"
import { refresToken } from "../refreshToken"
import validator from "validator"
const authController={
    async registerUser(req,res,next){
        try{
            const userBody  = pick(req.body,['name','email','password','username','avatar'])
            
            if(await Users.isEmailTaken(userBody.email))
                return next(ErrorHandler.badRequest('Email is already taken.'))

            if(await Users.isUserNameTaken(userBody.username))
                return next(ErrorHandler.badRequest('User Name is already taken.'))
 
            const user = await Users.create(userBody)
            
            const [accessToken , refreshToken] = await Promise.all([
                user.generateToken(),
                user.generateToken(config.jwt.refreshTokenExpiry,config.jwt.refreshToken),
                Profile.create({user:user._id})
            ])
            await refresToken.create({refersh_token:refreshToken})

            return res.data({accessToken,refreshToken,user},201)
        }catch(err){
            next(err)
        }
         

    },
    async loginUser(req,res,next){
        try {
            const {username,password}  = req.body
            const isEmail = validator.isEmail(username)
            const user = await Users.findByCredentials(username,password,isEmail);
            const [accessToken , refreshToken] = await Promise.all([
                user.generateToken(),
                user.generateToken(config.jwt.refreshTokenExpiry,config.jwt.refreshToken),
            ]);
            const userDetails = pick(user,['name','role','email'])
        return res.data({accessToken,refreshToken,userDetails})

        } catch (error) {
            next(error)
        }
         

    }
}

export default authController