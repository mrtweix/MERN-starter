import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from '../../config/config.js';
import User from '../../models/User.model.js';

const jwtStrategy = new JwtStrategy(
  {
    secretOrKey: config.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt')
  },
  async (req, payload, done) => {
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

passport.use(JwtStrategy);

export default jwtStrategy;
