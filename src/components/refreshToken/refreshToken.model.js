import mongoose from "mongoose";

const Schema = mongoose.Schema

const refreshTokenSchema = new Schema(
    {
        refresh_token:{
            type:String,
            required:true
        },
        user:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        expireIn:{
            type:Date,
            required:true
        }
    },{timestamps:true})

export default mongoose.model('refreshToken',refreshTokenSchema,'refreshTokens')