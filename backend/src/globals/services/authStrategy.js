import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from '../../config/config.js';
import User from '../../models/User.model.js';

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt')
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
);

export default jwtStrategy;
