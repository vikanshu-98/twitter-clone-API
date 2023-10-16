import express, { Router } from 'express'
import { authRoutes } from '../components/auth';

function getRoutes(){
    const router = express.Router() 
    router.use('/auth',authRoutes)   
    return router
}
 

export default getRoutes