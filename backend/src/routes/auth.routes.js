import express from 'express';
import roles from '../globals/permissions/roles.js';
import validate from '../globals/validations/validator.js';
import authController from '../controllers/auth.controller.js';
import protect from '../globals/middlewares/auth.middleware.js';
import validation from '../globals/validations/auth.validation.js';

const router = express.Router();

router.post('/signin', validate(validation.login), authController.userSignin);
router.post('/logout', validate(validation.tokenCheck), authController.userLogout);
router.post('/signup', validate(validation.register), authController.userSignup);
router.get('/verify_email/:token', authController.userEmailVerification);
router.post('/forgot_password', validate(validation.forgotPassword), authController.forgotPassword);
router.post('/reset_password/:token', validate(validation.resetPassword), authController.resetPassword);
router.post('/refreshToken', validate(validation.tokenCheck), authController.getRefreshToken);
router.get('/me', protect.authorize, protect.allowedRoles(roles.ADMIN, roles.USER), authController.getUserDetails);

export default router;
