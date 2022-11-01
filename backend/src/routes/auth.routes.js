import express from 'express';
import validate from '../validations/validator.js';
import validation from '../validations/auth.validation.js';
import authController from '../controllers/auth.controller.js';
import protect from '../globals/middlewares/auth.middleware.js';

const router = express.Router();

router.post('/signup', validate(validation.register), authController.userSignup);
router.post('/signin', validate(validation.login), authController.userSignin);
router.post('/logout', validate(validation.tokenCheck), authController.userLogout);
router.get('/verify_email/:token', authController.userEmailVerification);
router.post('/forgot_password', validate(validation.forgotPassword), authController.forgotPassword);
router.post('/reset_password/:token', validate(validation.resetPassword), authController.resetPassword);
router.get('/me', protect.authorize, authController.getUserDetails);

export default router;
