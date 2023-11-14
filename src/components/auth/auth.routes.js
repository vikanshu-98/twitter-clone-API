import  express from 'express';
import authValidation from './auth.validation'
import validate from '../../middleware/validate';
import authController  from "./auth.controller";
import auth from "../../middleware/auth";
 
const router = express.Router()

router.post('/register',validate(authValidation.register),authController.registerUser)
router.post('/login',validate(authValidation.login),authController.loginUser)
router.post('/refreshToken',validate(authValidation.refreshTokens),authController.refershToken)
router.post('/logout',auth('userAuth'),validate(authValidation.refreshTokens),authController.logout)

export default router  