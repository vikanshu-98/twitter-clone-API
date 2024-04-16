import  express from 'express';
import authValidation from './auth.validation'
import validate from '../../middleware/validate';
import authController  from "./auth.controller";
import auth from "../../middleware/auth";
import checkRefreshToken from '../../middleware/checkRefreshToken';
 
const router = express.Router()

router.post('/register',validate(authValidation.register),authController.registerUser)
router.post('/login',validate(authValidation.login),authController.loginUser)
router.post('/refreshToken',checkRefreshToken,validate(authValidation.refreshTokens),authController.refershToken)
router.post('/logout',auth(),checkRefreshToken,validate(authValidation.refreshTokens),authController.logout)

export default router  