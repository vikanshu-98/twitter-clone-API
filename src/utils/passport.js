import {ExtractJwt,Strategy as JwtStrategy } from 'passport-jwt'

import config from '../config/index'
import { Users } from '../components/users'
const option={
    secretOrKey : config.jwt.secretToken,
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken()
}

const verifyJwt = async (payload,done)=>{
    try {
        const isValidUser= await Users.findById(payload.id)
        // console.log(isValidUser)
        if(!isValidUser)
            return done(null,false)
        return done(null,isValidUser)

    } catch (error) {
        return done(error,false)
    }
    

}
export default new JwtStrategy(option,verifyJwt);