import httpStatus from "http-status";
import CustomError from "../services/customError.js";

const errorSerialize = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // Log to console for dev
  console.log("error serialize ", err.name, err.code);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found`;
    error = new CustomError(httpStatus.BAD_REQUEST, message);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new CustomError(httpStatus.BAD_REQUEST, message);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val)
      .join(", ");
    error = new CustomError(httpStatus.BAD_REQUEST, message);
  }

  res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: error.message || "Internal Server Error",
  });
};

export default errorSerialize;