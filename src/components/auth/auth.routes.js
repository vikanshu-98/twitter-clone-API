import  express from 'express';
import authValidation from './auth.validation'
import validate from '../../middleware/validate';
import authController  from "./auth.controller";
 
const router = express.Router()

router.post('/register',validate(authValidation.register),authController.registerUser)
router.post('/login',validate(authValidation.login),authController.loginUser)

export default router  