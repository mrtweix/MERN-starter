import express from 'express';
import authController from '../controllers/auth.controller.js';
import validation from '../validations/auth.validation.js';
import validate from '../validations/validator.js';

const router = express.Router();

router.route('/signup').post(validate(validation.register), authController.userSignup);
router.route('/signin').post(validate(validation.login), authController.userSignin);

export default router;
