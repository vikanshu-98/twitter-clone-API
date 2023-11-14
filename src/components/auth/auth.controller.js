import { pick } from "lodash" 
import { Users } from "../users"
import ErrorHandler from "../../service/ErrorHandler"
 
import config from "../../config"
import { Profile } from "../profile"
import {  refreshTokens } from "../refreshToken"
import validator from "validator"
import auth from "../../utils/auth"
import { BlackListedToken } from "../blackListToken"
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
            const currentDate = new Date()
            currentDate.setDate(currentDate.getDate()+config.js.refreshTokenExpiry) 
            await refresToken.create({refresh_token:refreshToken,user:user._id,expireIn:currentDate})

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
            const currentData = new Date()
            currentData.setDate(currentData.getDate()+config.js.refreshTokenExpiry) 

            await refreshTokens.create({refresh_token:refreshToken,user:user._id,expireIn:currentData})

            const userDetails = pick(user,['name','role','email'])
        return res.data({accessToken,refreshToken,userDetails})

        } catch (error) {
            next(error)
        }
         

    },
    async refershToken(req,res,next){
        try {
            const {refreshToken}= req.body
            const {id,role} = auth.verifyToken(refreshToken,config.jwt.refreshToken); //first check token is valid
            
            const isBlackListed = await BlackListedToken.findOne({$and:[{token:refreshToken},{user:id}]}) // check kra ke blacklisted toh nahi h nah
            if(isBlackListed)
                return next(ErrorHandler.unauthorized('Invalid refresh token because this token is blacklisted !!'))
 
            const isPresent = await refreshTokens.findOne({refresh_token:refreshToken}); // chk kra ke refresh token table toh present h nah
            if(!isPresent)
                return next(ErrorHandler.unauthorized('Invalid refresh token!!'))

            const user  = await Users.findOne({_id:id})
            if(!user)
                return next(ErrorHandler.unauthorized('Invalid refresh token!!'))
        
            
            const [accessToken , refreshToken1] =  await Promise.all([
                user.generateToken(),
                user.generateToken(config.jwt.refreshTokenExpiry,config.jwt.refreshToken),
            ]);
            
            const currentData = new Date()
            currentData.setDate(currentData.getDate()+config.js.refreshTokenExpiry)  
            await refreshTokens.create({refresh_token:refreshToken,user:user._id,expireIn:currentData})
            await BlackListedToken.create({token:refreshToken,user:user._id})
            return res.data({accessToken,refreshToken1})


        } catch (error) {
         return next(error)   
        }
    },
    async logout(req,res,next){
        try {   
            const {refreshToken}= req.body
            const {id,role} = auth.verifyToken(refreshToken,config.jwt.refreshToken); //first check token is valid
            const isBlackListed = await BlackListedToken.findOne({$and:[{token:refreshToken},{user:id}]}) // check kra ke blacklisted toh nahi h nah
            if(isBlackListed)
                return next(ErrorHandler.unauthorized('Invalid refresh token because this token is blacklisted'))
                
            const isPresent = await refreshTokens.findOne({$and:[{refresh_token:refreshToken},{user:id}]}); // chk kra ke refresh token table toh present h nah
            if(!isPresent)
                return next(ErrorHandler.unauthorized('Invalid refresh token!!'))
            
            if(await isPresent.remove())
                res.success(200,"logout successfully!!!!")
            

        } catch (error) {
            next(error)
        }
    }
}

export default authController