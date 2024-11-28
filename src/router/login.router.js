import express from 'express';
import { logInAdmin, logOutAdmin, signUpAdmin, updatePassword } from '../controller/adminLogin.controller.js';
const router = express.Router();


router.post('/updatePassword', updatePassword);

router.post('/signupAdmin', signUpAdmin);  // ✅

router.post('/loginAdmin', logInAdmin);  // ✅

router.get('/logoutAdmin', logOutAdmin);  // ✅



export default router;