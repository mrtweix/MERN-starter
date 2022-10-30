import { json, urlencoded } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import hpp from 'hpp';
import xss from 'xss-clean';
import config from '../../config/config.js';

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
  // enable cors
  app.use(
    cors({
      origin: config.CLIENT_URL,
      credentials: true,
      optionsSuccessStatus: 200,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    })
  );
};

export default securityMiddleware;
