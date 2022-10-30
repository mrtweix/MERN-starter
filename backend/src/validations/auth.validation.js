import Joi from 'joi';

const email = Joi.string().required().email().messages({
  'string.email': 'Invalid email address',
  'any.required': 'Email is required'
});
const password = Joi.string().required().messages({
  'any.required': 'Password is required'
});
const firstName = Joi.string().required();
const lastName = Joi.string().required();

const register = Joi.object().keys({ firstName, lastName, email, password });

const login = Joi.object().keys({ email, password });

const validation = {
  register,
  login
};

export default validation;
