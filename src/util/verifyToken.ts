import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const path = req.originalUrl;
  const token = req.headers['x-access-token'];
  console.log(req.headers);

  if (path === '/api/login') {
    next();
    return;
  } else if (path === '/api/users' && req.method === 'POST') {
    next();
    return;
  } else if (path.includes('doc')) {
    next();
    return;
  } else if (req.headers.referer?.includes('doc')) {
    next();
    return;
  }

  if (!token || Array.isArray(token))
    return res.status(401).json({ auth: false, message: 'Something is wrong with your token  or none was provided.' });

  try {
    passport.authenticate('token', { session: false })(req, res, next);
  } catch (e) {
    res.status(400).json(e);
  }
};
