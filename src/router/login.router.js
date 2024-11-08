import express from 'express';
import { logInAdmin, logOutAdmin, resetPOD, signUpAdmin, updatePassword } from '../controller/adminLogin.controller.js';
import { newMentorAdd, getMentors,updateMentees,removeMentees } from '../controller/newMentor.controller.js';
const router = express.Router();

// Route to add a new mentor
router.post('/addMentor', newMentorAdd);

router.post('/updatePassword', updatePassword);

router.post('/signupAdmin', signUpAdmin);  // ✅

router.post('/loginAdmin', logInAdmin);  // ✅

router.get('/logoutAdmin', logOutAdmin);  // ✅

router.post('/reset-pod-submission-status',resetPOD);


// 1. Route to get all mentor details
router.get('/mentors', getMentors);

// 2. Route to add a mentee to a mentor
router.post('/:mentorId/addMentee', updateMentees);

// 3. Route to remove a mentee from a mentor
router.post('/:mentorId/removeMentee', removeMentees);


export default router;