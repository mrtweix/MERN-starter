import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../../config/config.js';
import User from '../../models/User.model.js';
import CustomError from '../utility/customError.js';
import asyncHandler from './asyncHandler.middleware.js';

const authorize = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ').pop();
    try {
      // Validate token
      const payload = jwt.verify(token, config.JWT_SECRET);

      // find and return user details
      const user = await User.findOne({
        $and: [{ _id: payload.id }, { isEmailConfirmed: true }]
      }).select('-password');

      req.user = user;
      next();
    } catch (err) {
      return next(new CustomError(httpStatus.FORBIDDEN, 'Forbidden access'));
    }
  }

  if (!token) return next(new CustomError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
});

// Grant access to specific roles
const allowedRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new CustomError(httpStatus.BAD_REQUEST, 'Not allowed to access this role'));
    next();
  };
};

const protect = {
  authorize,
  allowedRoles
};

export default protect;
