import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import config from '../../config/config.js';
import User from '../../models/User.model.js';
import CustomError from '../services/customError.js';
import asyncHandler from './asyncHandler.middleware.js';

const authorize = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ').pop();
    try {
      // Validate token
      const payload = jwt.verify(token, config.JWT_SECRET);

      const user = await User.findOne({
        $and: [{ _id: payload.id }, { isEmailConfirmed: true }]
      }).select('-password');

      req.user = user;
      next();
    } catch (err) {
      return next(new CustomError(httpStatus.FORBIDDEN, 'Not authorized', 'FORBIDDEN'));
    }
  }

  if (!token) {
    return next(new CustomError(httpStatus.FORBIDDEN, 'Not authorized', 'FORBIDDEN'));
  }
});

const protect = {
  authorize
};

export default protect;
