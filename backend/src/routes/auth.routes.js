import express from 'express';
import authController from '../controllers/auth.controller.js';
import validation from '../validations/auth.validation.js';
import validate from '../validations/validator.js';

const router = express.Router();

router.post('/signup', validate(validation.register), authController.userSignup);
router.post('/signin', validate(validation.login), authController.userSignin);
router.get('/verify_email/:token', authController.verifyEmailActivation);
router.post('/forgot_password', authController.forgotPassword);

export default router;
