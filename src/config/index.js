import dotenv from 'dotenv'
import path from 'path'
dotenv.config(path.join(__dirname,'../../.env'))

export default {
    env:"",
    port: process.env.PORT,
    debugMode:process.env.DEBUG_MODE,
    mongoose:{
        uri:process.env.MONGO_URL,
        options: {
            useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        }
    },
    jwt:{
        secretToken:process.env.SECRET_KEY,
        secretTokenExpiry:process.env.SECRET_TOKEN_EXPIRY,
        refreshToken:process.env.REFRESH_TOKEN_KEY,
        refreshTokenExpiry:process.env.REFRESh_TOKEN_EXPIRY
    }
}