import mongoose from "mongoose";

const Schema =  mongoose.Schema

const blackListedToken = new Schema(
    {
        token:{
            type:String,
            Required:true
        },
        user:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
        reason:{
            type:String,
        }
    },{
        timestamps:true
    }
)

export default mongoose.model('blackListedToken',blackListedToken,'blackListedToken')
