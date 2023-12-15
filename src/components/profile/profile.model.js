import mongoose from "mongoose";
import validator from "validator";
import ErrorHandler from "../../service/ErrorHandler";
import paginatePlugin from "../../utils/pagination";
const Schema =mongoose.Schema;

const ProfileSchema = new Schema({
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



ProfileSchema.methods.isFollow = function(userId) {
    return this.following.some((id) => id.equals(userId));
};

ProfileSchema.methods.isFollower = function(userId) {
    return this.followers.some((id) => id.equals(userId));
};

ProfileSchema.methods.follow = function(userId) {
    if(!(this.following.some((id) => id.equals(userId)))){
        this.following.push(userId)
        this.save()
    }
    return Promise.resolve(this)
};

ProfileSchema.methods.unFollow = function(userId) {

    if((this.following.some((id) => id.equals(userId)))){
        this.following.remove(userId)
        this.save()
    }
    return Promise.resolve(this)
};

ProfileSchema.plugin(paginatePlugin)
 

export default mongoose.model('profile',ProfileSchema,'Profiles')