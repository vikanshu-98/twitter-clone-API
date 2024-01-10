import express from 'express'
import seedDB from '../config/db'
const router= express.Router()
router.post('/seed',async(req,res)=>{
    seedDB.seedDB();
    return res.success()
})




export default router