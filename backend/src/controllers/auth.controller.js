import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import httpStatus from 'http-status';
import config from '../config/config.js';
import User from '../models/User.model.js';
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
  const userExists = await User.findOne({ email });
  if (userExists) return next(new customError(httpStatus.BAD_REQUEST, 'User already exists', 'BAD_REQUEST'));

  // Create user
  const user = await User.create(req.body);

  // Generate email confirm token
  const confirmEmailToken = await tokenService.generateVerifyEmailToken(user);

  // Create confirm url
  const confirmEmailURL = `${req.protocol}://${config.FRONTEND_HOST}/confirm_email?token=${confirmEmailToken}`;

  // prepare template
  let sendMessage = fs.readFileSync(path.resolve(__dirname, '../shared/templates/confirmEmail.html'), {
    encoding: 'utf-8',
    flag: 'r'
  });
  sendMessage = sendMessage.replace('{{confirmEmailURL}}', confirmEmailURL);
  sendMessage = sendMessage.replace('{{email}}', user.email);

  await User.findByIdAndUpdate(
    user.id,
    { confirmEmailToken },
    {
      new: true,
      runValidators: true
    }
  );

  await emailService({
    email: user.email,
    subject: 'Account activation verification',
    html: sendMessage
  });

  res.status(200).json({
    success: true,
    message: `Check your mail a verification link has been sent on ${user.email}`,
    sendMessage
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
  res.status(httpStatus.OK).json({ success: true, data: { user, ...tokens } });
});

const authController = {
  userSignup,
  userSignin
};
export default authController;
