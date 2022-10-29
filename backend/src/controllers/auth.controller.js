import httpStatus from "http-status";
import User from "../models/User.model.js";
import tokenService from "../globals/services/tokenService.js";
import customError from "../globals/services/customError.js";
import asyncHandler from "../globals/middlewares/asyncHandler.middleware.js";

const userSignup = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists)
    return next(new customError(httpStatus.BAD_REQUEST, "User already exists"));
  const user = await User.create(req.body);
  const tokens = await tokenService.generateAuthToken(user);
  console.log({ tokens });
  res.status(httpStatus.CREATED).json({ user, tokens });
});

const authController = {
  userSignup,
};
export default authController;
