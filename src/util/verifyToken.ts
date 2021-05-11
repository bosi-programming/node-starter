import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { notSoSecret } from '../app';
import { User } from '../models/user';

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const path = req.originalUrl;
  const token = req.headers['x-access-token'];

  if (path === '/api/login') {
    next();
    return;
  } else if (path === '/api/users' && req.method === 'POST') {
    next();
    return;
  } else if (path.includes('doc')) {
    next();
    return;
  }

  if (!token || Array.isArray(token))
    return res.status(401).json({ auth: false, message: 'Something is wrong with your token  or none was provided.' });

  try {
    const decoded: any = jwt.verify(token, notSoSecret);
    const user = await User.findById(decoded.id);
    req.body.user = user;
    next();
  } catch (e) {
    res.status(400).json(e);
  }
};
