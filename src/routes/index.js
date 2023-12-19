import express from 'express'
import { authRoutes } from '../components/auth';
import {userRoutes} from '../components/users'
import { ProfileRoutes } from '../components/profile';
import { TweetRoutes } from '../components/tweets';
function getRoutes(){
    const router = express.Router() 
    router.use('/auth',authRoutes)   
    router.use('/user',userRoutes)
    router.use('/profile',ProfileRoutes)
    router.use('/tweet',TweetRoutes)

    return router
}
 

export default getRoutes