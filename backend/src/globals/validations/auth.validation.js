import Joi from 'joi';

// Fields
const email = Joi.string().required().email().messages({
  'string.email': 'Invalid email address',
  'any.required': 'Email is required'
});
const password = Joi.string().required().messages({
  'any.required': 'Password is required'
});
const newPassword = Joi.string().required().messages({
  'any.required': 'New password is required'
});
const firstName = Joi.string().required();
const lastName = Joi.string().required();
const refreshToken = Joi.string().required();

// SchemaTypes
const register = Joi.object().keys({ firstName, lastName, email, password });
const login = Joi.object().keys({ email, password });
const forgotPassword = Joi.object().keys({ email });
const tokenCheck = Joi.object().keys({ refreshToken });
const resetPassword = Joi.object().keys({ newPassword });

const validation = {
  register,
  login,
  forgotPassword,
  tokenCheck,
  resetPassword
};

export default validation;
