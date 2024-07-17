import express from 'express';
import { logInAdmin, logOutAdmin, signUpAdmin } from '../controller/adminLogin.controller.js';
import { newUserAdd } from '../controller/newUser.controller.js';
import protectRoute from '../middleware/admin.middleware.js';

const router = express.Router();

router.post('/newUser',protectRoute,newUserAdd);  //

router.post('/signupAdmin', signUpAdmin);  // ✅

router.post('/loginAdmin', logInAdmin);  // ✅

router.get('/logoutAdmin', logOutAdmin);  // ✅


export default router;