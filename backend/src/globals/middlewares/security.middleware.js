import hpp from 'hpp';
import cors from 'cors';
import xss from 'xss-clean';
import helmet from 'helmet';
import passport from 'passport';
import httpStatus from 'http-status';
import compression from 'compression';
import { json, urlencoded } from 'express';
import config from '../../config/config.js';
import mongoSanitize from 'express-mongo-sanitize';
import CustomError from '../services/customError.js';

const securityMiddleware = (app) => {
  // http parameters pollution security
  app.use(hpp());
  // set security HTTP headers
  app.use(helmet());
  // sanitize request data
  app.use(xss());
  app.use(mongoSanitize());
  // gzip compression
  app.use(compression());
  // parse json request body
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  // reducing fingerprint
  app.disable('x-powered-by');
  // enable cors
  app.use(
    cors({
      origin: (origin, callback) => {
        if (config.allowedOrigins.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new CustomError(httpStatus.FORBIDDEN, 'Invalid access blocked by CORS'));
        }
      },
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );
  // jwt authentication
  app.use(passport.initialize());
};

export default securityMiddleware;
