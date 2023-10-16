import config from '../config'
import jwt from 'jsonwebtoken'

import bcrypt from 'bcryptjs'


const generateToken = function(payload,expiry,secrey_key){
    return jwt.sign(payload,secrey_key,{expiresIn:expiry})
}

const verifyToken= function(token,secret_key=config.jwt.secretToken){
    return jwt.verify(token,secret_key);
}

const hashedPassword = async function(password,salt=10){
    return await bcrypt.hash(password,salt=10);
}

const comparePassword = async function(password,userString){console.log(password)
    return await bcrypt.compare(userString,password)

}

export default {
    generateToken,verifyToken,hashedPassword,comparePassword
}