import jwt from 'jsonwebtoken';

export const verifyJwtToken = (token) => {
  try {
    if (token) {
      const decodedToken = jwt.verify(token, process.env.REACT_APP_JWT_SECRET);
      return decodedToken;
    }
    return null;
  } catch (error) {
    return error;
  }
};

export const jwtDecode = (token) => {
  try {
    if (token) {
      const decodedToken = jwt.decode(token);
      console.log({ decodedToken });
      return decodedToken;
    }
    return null;
  } catch (error) {
    return false;
  }
};
