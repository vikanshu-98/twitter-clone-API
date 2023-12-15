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
.delete(auth(),validate(profileValidation.ProfileRoutes),ProfileController.unfollowProfile)

// router.patch('/updateProfile',auth(),validate(profileValidation.updateProfile),ProfileController.updateProfile)
router.patch('/updateProfile/:userId',auth('manageUsers'),validate(profileValidation.updateProfile),ProfileController.updateProfileForAdmin)
export default router