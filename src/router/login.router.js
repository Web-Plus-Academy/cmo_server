import express from 'express';
import { logInAdmin, logOutAdmin, resetPOD, signUpAdmin } from '../controller/adminLogin.controller.js';
import { newUserAdd } from '../controller/newUser.controller.js';
// import protectRoute from '../middleware/admin.middleware.js';

const router = express.Router();

router.post('/newUser',newUserAdd);  //
// router.post('/newUser',protectRoute,newUserAdd);  

router.post('/signupAdmin', signUpAdmin);  // ✅

router.post('/loginAdmin', logInAdmin);  // ✅

router.get('/logoutAdmin', logOutAdmin);  // ✅

router.post('/reset-pod-submission-status',resetPOD);


export default router;