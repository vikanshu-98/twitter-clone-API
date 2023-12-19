import mongoose from "mongoose";
import { Tweets } from ".";
import paginatePlugin from "../../utils/pagination";
const Schema =mongoose.Schema

const tweetScheema =new Schema({
    author:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    text:{
        required:true,
        type:String
    },
    replyTo:{
        type:Schema.Types.ObjectId,
        ref:'Tweet'
    },
    repliesCount:{
        type:Number,
        default:0
    },
    edited:{
        type:Boolean,
        default:false
    },
    likes:[
        {
            type:Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    retweets:[
        {
            type:Schema.Types.ObjectId,
            ref:'Tweet'
        }
    ]

},{timestamps:true})


tweetScheema.methods.updateReplyCount = async function(){
    this.repliesCount = await Tweets.countDocuments({replyTo:this._id})
    this.save()
}

tweetScheema.methods.like =  function(userId){
    if(!(this.likes.some((id)=>id.equals(userId)))){
        this.likes.push(userId)
        this.save()
    }
    return Promise.resolve(this)

}



tweetScheema.methods.unlike = function (userId){
    if(this.likes.some(id=>id.equals(userId))){
        this.likes.remove(userId)
        this.save()
    }
    return Promise.resolve(this)
}


tweetScheema.plugin(paginatePlugin)
export default mongoose.model('Tweet',tweetScheema,'tweets')




