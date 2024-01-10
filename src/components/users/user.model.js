import mongoose from "mongoose";
import ErrorHandler from "../../service/ErrorHandler";
import validator from 'validator'
import roles from "../../config/roles";
import auth from "../../utils/auth";
import config from "../../config";
import paginatePlugin from "../../utils/pagination";

const Schema = mongoose.Schema

const userSchema = new Schema({

    name:{
        type:String,
        required:true,
        trim:true
    },
    username:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
        validate(value){
            if(value.match(/^[0-9a-zA-Z_.-]+$/)){
                ErrorHandler.notFound('user Name only contains number,letters, "." , "-", "_"')
            }
        }
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new ErrorHandler(400, 'Invalid email');
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:8,
        validate(value){
            if(!value.match(/\d/) || !value.match(/[a-zA-Z]/)){
                throw new ErrorHandler(400, 'password must contain at least one number and one letter') 
            }
        }
    },
    role:{
        type:String,
        enum:roles.roles,
        default:'user'
    },
    avatar:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new ErrorHandler(400, 'Avatar must be a valid URL');
            }
        }
    }
},{
    timestamps:true
})


userSchema.statics.isEmailTaken = async function(email){
    const user =await this.findOne({
        email:email.toLowerCase()
    })
    return !!user
}

userSchema.statics.isUserNameTaken = async function(username){
    const user =await this.findOne({
        username:username.toLowerCase()
    })
    return !!user
}


userSchema.pre('save',async function(next){ 
    try{
        if(this.isModified('password')){
            const hashedPassword = await auth.hashedPassword(this.password);
            this.password=hashedPassword
        }
        // if(this.isModified('username')){

        // }
        next()
    } 
    catch(err){
        return next(err);
    } 
})

userSchema.methods.generateToken = function(expiry=config.jwt.secretTokenExpiry,secretKey=config.jwt.secretToken){
    const payload = {id:this._id,role:this.role};

    return auth.generateToken(payload,expiry,secretKey);
}

userSchema.statics.findByCredentials = async function(username,password,isEmail){
    const user =await this.findOne({[isEmail?'email':'username']:username})
    if(!user)
        throw ErrorHandler.badRequest('Invalid login credentials')
    if(!await auth.comparePassword(user.password,password))
        throw ErrorHandler.badRequest('Invalid login credentials')

    return user;
}

userSchema.methods.getOnlySpecificData=function(){
    return {
        id:this._id,
        name:this.name,
        userName:this.userName,
        email:this.email,
        createdAt:this.createdAt,
        role:this.role
    }
}

userSchema.plugin(paginatePlugin)

export default mongoose.model('User',userSchema,'users')