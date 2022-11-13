import moment from 'moment';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import customError from './customError.js';
import config from '../../config/config.js';
import User from '../../models/User.model.js';
import Token from '../../models/Token.model.js';

const generateNewToken = (userId, role, email, expires, type, secret = config.JWT_SECRET) => {
  const payload = {
    id: userId,
    role,
    email,
    iat: moment().unix(),
    exp: expires.unix(),
    type
  };
  return jwt.sign(payload, secret);
};

const storeToken = async (token, userId, expires, type) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type
  });
  return tokenDoc;
};

const verifyToken = async (token, type) => {
  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    const tokenDoc = await Token.findOne({
      token,
      type,
      user: payload.id
    });

    if (!tokenDoc) return false;
    return tokenDoc;
  } catch (e) {
    return false;
  }
};

const generateAuthToken = async (user) => {
  const accessTokenExpires = moment().add(config.JWT_ACCESS_EXPIRATION_TIME, 'minutes');
  const accessToken = generateNewToken(user.id, user.role, user.email, accessTokenExpires, config.ACCESS_TOKEN);

  const refreshTokenExpires = moment().add(config.JWT_REFRESH_EXPIRATION_DAYS, 'days');
  const refreshToken = generateNewToken(user.id, user.role, user.email, refreshTokenExpires, config.REFRESH_TOKEN);

  await storeToken(refreshToken, user.id, refreshTokenExpires, config.REFRESH_TOKEN);
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate()
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate()
    }
  };
};

const generateResetPasswordToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new customError(httpStatus.NOT_FOUND, 'No user found with given email');

  const expires = moment().add(config.JWT_RESET_PASSWORD_EXPIRATION_DAYS, 'days');
  const resetPasswordToken = generateNewToken(user.id, user.role, email, expires, config.RESET_PASSWORD_TOKEN);

  await storeToken(resetPasswordToken, user.id, expires, config.RESET_PASSWORD_TOKEN);
  return resetPasswordToken;
};

const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(config.JWT_RESET_PASSWORD_EXPIRATION_DAYS, 'days');
  const verifyEmailToken = generateNewToken(user.id, user.role, user.email, expires, config.VERIFY_EMAIL_TOKEN);

  await storeToken(verifyEmailToken, user.id, expires, config.VERIFY_EMAIL_TOKEN);
  return verifyEmailToken;
};

const removeSavedToken = async (token) => {
  try {
    const tokenData = await Token.findOneAndRemove({
      token: token,
      type: config.REFRESH_TOKEN
    });
    if (!tokenData) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  generateNewToken,
  storeToken,
  verifyToken,
  generateAuthToken,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  removeSavedToken
};
