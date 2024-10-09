import express from 'express';
import { registerUser, registerAdmin, sendEmail, resetPass, Login, verifyOTP, searchUser, orderBook } from '../controllers/auth.controller.js';

const router = express.Router();

//Registration
router.post('/register', registerUser);

//Registartion As Admin
router.post('/register-admin',registerAdmin);

//Login
router.post('/login', Login);

//send reset pass email
router.post('/send-email', sendEmail);

//Reset Password
router.post('/resetPass',resetPass);

router.post('/verify-otp', verifyOTP);

router.get('/searchuser', searchUser);

router.post('/issueBook', orderBook);
export default router;

