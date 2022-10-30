import config from '../config/config.js';
import authRoutes from './auth.routes.js';

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes
  }
];

const mountRoutes = (app) => {
  defaultRoutes.forEach((router) => {
    app.use(`${config.BASE_PATH}${router.path}`, router.route);
  });
};

export default mountRoutes;
