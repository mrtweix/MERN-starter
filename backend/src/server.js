import morgan from 'morgan';
import express from 'express';
import httpStatus from 'http-status';
import config from './config/config.js';
import mountRoutes from './routes/index.js';
import runServer from './config/runServer.js';
import dbConnect from './config/dbConnect.js';
import rateLimiter from './globals/utility/rateLimiter.js';
import securityMiddleware from './globals/middlewares/security.middleware.js';
import errorSerialize from './globals/middlewares/errorSerialize.middleware.js';

const app = express();

// database connection
dbConnect();

// logger configuration
if (config.NODE_ENV == 'DEVELOPMENT') {
  app.use(morgan('common'));
} else {
  app.use(morgan('combined'));
}

// set security middleware
securityMiddleware(app);

// limit repeated failed requests to auth endpoints
if (config.NODE_ENV === 'production') {
  app.use('/api/v1/auth', rateLimiter);
}

// mount routes
mountRoutes(app);
app.use(errorSerialize);

// 200 status for base url of the application route
app.get('/', function (req, res) {
  res.status(200).json({ message: 'Base route found' });
});

// send 404 error for any unknown api request
app.use((err, req, res, next) => {
  if (err) return res.status(httpStatus.NOT_FOUND).json({ success: false, message: 'No such route found' });
  next();
});

// server initiated
runServer(app);
