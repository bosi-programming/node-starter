import config from 'config';
import passport from 'passport';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';

import { User } from './models/user';

const secret: string = config.get('secret');

passport.serializeUser((user, done) => {
  // @ts-ignore
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (e) {
    done(e, null);
  }
});

const LocalStrategy = passportLocal.Strategy;
const localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findByUserName(username);

    if (user && User.validatePassword(user, password)) {
      return done(null, user);
    } else if (user) {
      return done(null, false, { message: 'Incorrect password.' });
    } else {
      return done(null, false, { message: 'Incorrect username.' });
    }
  } catch (e) {
    return done(e);
  }
});

passport.use('login', localStrategy);

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const issuer: string = config.get('token.issuer');
const audience: string = config.get('token.audience');

export const tokenOps = {
  expiresIn: '2 days',
  issuer,
  audience,
};

const opts = {
  jwtFromRequest: ExtractJwt.fromHeader('x-access-token'),
  secretOrKey: secret,
  ...tokenOps,
};

const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.sub);

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (e) {
    done(e, false);
  }
});

passport.use('token', jwtStrategy);
