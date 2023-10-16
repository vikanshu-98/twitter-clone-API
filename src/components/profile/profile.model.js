import mongoose from "mongoose";
import validator from "validator";
import ErrorHandler from "../../service/ErrorHandler";
const Schema =mongoose.Schema;

const profileSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    bio:{
        type:String,
        trim:true
    },
    location:{
        type:String,
        trime:true
    },
    website:{
        type:String,
        trim:true,
        validate(value){
            if(!validator.isURL(value)){
                throw new ErrorHandler.badRequest('website must be valid URL')
            }
        }
    },
    birthday:{
        type:Date
    },
    backgroundImage:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new ErrorHandler.badRequest('Background Image must be a valid URL')
            }
        }
    },
    following:[{type:Schema.Types.ObjectId,ref:"User"}],
    followers:[{type:Schema.Types.ObjectId,ref:"User"}],
    likes:[{type:Schema.Types.ObjectId,ref:"Tweet"}],
    reTweet:[{type:Schema.Types.ObjectId,ref:"Tweet"}]
},{timestamps:true})


export default mongoose.model('profile',profileSchema,'Profiles')