import express from 'express'
 
import validate from '../../middleware/validate'
import profileValidation from './profile.validation'
import ProfileController from './profile.controller' 
import auth from '../../middleware/auth'
const router = express.Router()

router.get('/:userId',validate(profileValidation.ProfileRoutes),ProfileController.getProfile)

router.get('/',validate(profileValidation.getProfilesValidation),ProfileController.getProfiles)

router.route('/follow/:userId')
.get(auth(),validate(profileValidation.ProfileRoutes),ProfileController.followProfile)


export default router