import express from 'express';
import authController from '../controllers/auth.controller.js';
import validation from '../validations/auth.validation.js';
import validate from '../validations/validator.js';

const router = express.Router();

router.post('/signup', validate(validation.register), authController.userSignup);
router.post('/signin', validate(validation.login), authController.userSignin);
router.post('/logout', authController.userLogout);
router.get('/verify_email/:token', authController.userEmailVerification);
router.post('/forgot_password', validate(validation.forgotPassword), authController.forgotPassword);

export default router;
