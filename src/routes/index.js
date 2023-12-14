import express from 'express'
import { authRoutes } from '../components/auth';
import {userRoutes} from '../components/users'
import { ProfileRoutes } from '../components/profile';
function getRoutes(){
    const router = express.Router() 
    router.use('/auth',authRoutes)   
    router.use('/user',userRoutes)
    router.use('/profile',ProfileRoutes)

    return router
}
 

export default getRoutes