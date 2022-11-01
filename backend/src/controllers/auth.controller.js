import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import httpStatus from 'http-status';
import config from '../config/config.js';
import User from '../models/User.model.js';
import Token from '../models/Token.model.js';
import customError from '../globals/services/customError.js';
import tokenService from '../globals/services/tokenService.js';
import emailService from '../globals/services/emailService.js';
import asyncHandler from '../globals/middlewares/asyncHandler.middleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Signup user
// @route   POST /api/v1/auth/signup
// @access  Public
const userSignup = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Check user exists
  const userExists = await User.findOne({ email }).lean();
  if (userExists) return next(new customError(httpStatus.BAD_REQUEST, 'User already exists', 'BAD_REQUEST'));

  // Create user
  const user = await User.create(req.body);

  // Generate email confirm token
  const confirmEmailToken = await tokenService.generateVerifyEmailToken(user);

  // Create confirm url
  const confirmEmailURL = `${req.protocol}://${config.FRONTEND_HOST}/confirm_email?token=${confirmEmailToken}`;

  // Prepare template
  let sendMessage = fs.readFileSync(path.resolve(__dirname, '../shared/templates/confirmEmail.html'), {
    encoding: 'utf-8',
    flag: 'r'
  });
  sendMessage = sendMessage.replace('{{confirmEmailURL}}', confirmEmailURL);
  sendMessage = sendMessage.replace('{{confirmURL}}', confirmEmailURL);
  sendMessage = sendMessage.replace('{{email}}', user.email);

  // Send mail
  await emailService({
    email: user.email,
    subject: 'Account activation verification',
    html: sendMessage
  });

  // Final result
  res.status(httpStatus.OK).json({
    success: true,
    result: `Check your mail a verification link has been sent on ${user.email}`
  });
});

// @desc    Signin user
// @route   POST /api/v1/auth/signin
// @access  Public
const userSignin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check user exists
  const user = await User.findOne({ email });
  if (!user) return next(new customError(httpStatus.NOT_FOUND, 'No user with email found', 'NOT_FOUND'));

  // Check password matches
  const passMatch = await user.matchPassword(password);
  if (!passMatch) return next(new customError(httpStatus.UNAUTHORIZED, 'Invalid credentials', 'UNAUTHORIZED'));

  // Generate token
  const tokens = await tokenService.generateAuthToken(user);

  // Final result
  res.status(httpStatus.OK).json({ success: true, result: { user, ...tokens } });
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
const userLogout = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  // Validate token
  const isValidToken = await tokenService.verifyToken(refreshToken, config.REFRESH_TOKEN);
  if (!isValidToken) return next(new customError(httpStatus.BAD_REQUEST, 'This request is invalid', 'BAD_REQUEST'));

  // Update record
  await isValidToken.remove();

  // Final result
  res.status(httpStatus.ACCEPTED).json({ success: true, result: 'Logout successful' });
});

// @desc    Verify email
// @route   GET /api/v1/auth/verify-email/:token
// @access  Private
const userEmailVerification = asyncHandler(async (req, res, next) => {
  const token = req.params.token;

  // Validate token
  const isValidToken = await tokenService.verifyToken(token, config.VERIFY_EMAIL_TOKEN);
  if (!isValidToken) return next(new customError(httpStatus.BAD_REQUEST, 'This request is invalid', 'BAD_REQUEST'));

  // Update record
  await isValidToken.remove();
  await User.findOneAndUpdate(
    {
      $and: [{ _id: isValidToken.user }, { isEmailConfirmed: false }]
    },
    {
      isEmailConfirmed: true
    },
    {
      runValidators: true,
      returnNewDocument: true
    }
  );

  // Final result
  res.status(httpStatus.CREATED).json({ success: true, result: 'Account is activated' });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot_password
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Generate reset link
  const resetPasswordToken = await tokenService.generateResetPasswordToken(email);
  // Create confirm url
  const resetPasswordURL = `${req.protocol}://${config.FRONTEND_HOST}/reset_password?token=${resetPasswordToken}`;

  // Prepare template
  let sendMessage = fs.readFileSync(path.resolve(__dirname, '../shared/templates/resetPassword.html'), {
    encoding: 'utf-8',
    flag: 'r'
  });
  sendMessage = sendMessage.replace('{{resetPasswordURL}}', resetPasswordURL);
  sendMessage = sendMessage.replace('{{resetPasswordLink}}', resetPasswordURL);
  sendMessage = sendMessage.replace('{{email}}', email);

  // Send mail
  await emailService({
    email: email,
    subject: 'Reset account password',
    html: sendMessage
  });

  // Final result
  res.status(httpStatus.CREATED).json({
    success: true,
    result: `Check your mail. A reset link has been sent on ${email}`
  });
});

// @desc    Reset password
// @route   POST /api/v1/auth/reset_password/:token
// @access  Private
const resetPassword = asyncHandler(async (req, res, next) => {
  const token = req.params.token;
  const { newPassword } = req.body;

  // Validate token
  const isValidToken = await tokenService.verifyToken(token, config.RESET_PASSWORD_TOKEN);
  if (!isValidToken) return next(new customError(httpStatus.BAD_REQUEST, 'This request is invalid', 'BAD_REQUEST'));

  // Validate user and update password
  const user = await User.findOne({
    $and: [{ _id: isValidToken.user }, { isEmailConfirmed: true }]
  });
  if (!user) return next(new customError(httpStatus.NOT_FOUND, 'No user with email found', 'NOT_FOUND'));

  user.password = newPassword;
  await user.save();

  // Cleanup
  await Token.deleteMany({ user: isValidToken.user, type: config.RESET_PASSWORD_TOKEN });

  // Final result
  res.status(httpStatus.CREATED).json({
    success: true,
    result: 'Password has been updated successfully'
  });
});

// @desc    Get user information
// @route   POST /api/v1/auth/me
// @access  Private
const getUserDetails = asyncHandler(async (req, res, next) => {
  const user = req.user;

  // Final result
  res.status(httpStatus.OK).json({
    success: true,
    result: user
  });
});

const authController = {
  userSignup,
  userSignin,
  userLogout,
  userEmailVerification,
  forgotPassword,
  resetPassword,
  getUserDetails
};
export default authController;
