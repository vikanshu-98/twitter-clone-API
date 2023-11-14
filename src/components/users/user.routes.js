import express from "express";
import auth from "../../middleware/auth";
import userController from "./user.controller"; 
import validate from "../../middleware/validate";
import userValidation from "./user.validation";
 
const router = express.Router()

router.get('/',auth('getUsers'),userController.getUsers)

/*
 * @route   POST api/users
 * @desc    get user by user id
 * @access  Admin,owner
*/

router.get('/getUser/:userId',auth('getUsers'),validate(userValidation.getUser), userController.getSingleUser)


/*
 * @desc    create new user 
 * @access  Admin
*/

router.post('/',auth('manageUsers'),validate(userValidation.createUser), userController.createUser)

router.patch('/:userId',auth('manageUsers'),validate(userValidation.updateUser),userController.updateUser)

router.delete('/:userId',auth('manageUsers'),validate(userValidation.getUser),userController.deleteUser)
 
export default router