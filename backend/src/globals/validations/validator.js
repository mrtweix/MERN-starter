import httpStatus from 'http-status';

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(httpStatus.BAD_REQUEST).json({ success: false, error: error.details[0].message });
  } else {
    next();
  }
};

export default validate;
