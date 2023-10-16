import mongoose from "mongoose";

const Schema = mongoose.Schema

const refreshTokenSchema = new Schema(
    {
        refersh_token:{
            type:String,
            required:true
        }
    },{timestamps:true})

export default mongoose.model('refreshToken',refreshTokenSchema,'refreshTokens')