import express from 'express'
import { authRoutes } from '../components/auth';
import {userRoutes} from '../components/users'
function getRoutes(){
    const router = express.Router() 
    router.use('/auth',authRoutes)   
    router.use('/user',userRoutes)   
    return router
}
 

export default getRoutes