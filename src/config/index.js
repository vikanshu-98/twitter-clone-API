import dotenv from 'dotenv'
import path from 'path'
dotenv.config(path.join(__dirname,'../../.env'))

export default {
    env:"",
    mongoose:{
        uri:process.env.MONGO_URL
    }
}