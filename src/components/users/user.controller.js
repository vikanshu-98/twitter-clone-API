import { filter, pick } from "lodash"
import { Users } from ".";
import ErrorHandler from "../../service/ErrorHandler";
import { Profile } from "../profile";
import {faker} from '@faker-js/faker'

const userController ={
    async getUsers(req,res,next){
        const filters = pick(req.query, ['name', 'role']);
        const options = pick(req.query,['limit','sortBy','page']) 
        const result = await Users.paginate(options,filters)
        return res.data(result);
    },
    async getSingleUser(req,res,next){
        const {userId} =  req.params
        const user = await Users.findById(userId).select('-password -updatedAt -__v')

        if(!user)
            next(ErrorHandler.notFound("User Not Found."))
        
        return res.data(user);

    },

    async createUser(req,res,next){
        try{
            const userBody  = pick(req.body,['name','email','password','username','avatar','role'])
            if(await Users.isEmailTaken(userBody.email))
                return next(ErrorHandler.badRequest('Email is already taken.'))
            
            if(await Users.isEmailTaken(userBody.username))
                return next(ErrorHandler.badRequest('User Name is already taken.'))
    
            const user = new Users(userBody)
            const [newuser] = await Promise.all([user.save(),Profile.create({user:user._id})])
            return res.data(newuser.getOnlySpecificData(),201)
        }catch(err){
            next(err)
        }
        
    },


    async updateUser(req,res,next){
        try {
            const userBody = pick(req.body,['name','email','password','role','avatar','username'])   
            const {userId} = req.params
            const user = await Users.findById(userId)
            if(!user)
                next(ErrorHandler.notFound('user not found'))

            if(await Users.isEmailTaken(userBody.email))
                return next(ErrorHandler.badRequest('Email is already taken.'))
            
            if(await Users.isEmailTaken(userBody.username))
                return next(ErrorHandler.badRequest('User Name is already taken.'))

            Object.assign(user,userBody)
            if(await user.save())
                return res.success(200,'user details updated sucessfully!!')
            
        } catch (error) {
            next(error) 
        }
    },
    async deleteUser(req,res,next){
        try {
            const {userId} = req.params
            console.log(userId)
            const user = await Users.findById(userId)
            if(!user)
                return next(ErrorHandler.notFound('User Not Found.'))

            await Promise.all([user.remove(),Profile.findOneAndRemove({user:user._id})])
            return res.data(user.getOnlySpecificData(),200,'user deleted successfully!!')

        } catch (error) {
            next(error)
        }
 
    }
}  
export default userController 




