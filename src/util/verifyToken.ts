import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { notSoSecret } from '../app';
import { User } from '../models/user';

export const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
  const path = req.originalUrl;
  const token = req.headers['x-access-token'];
  const hasToken = Boolean(token);

  if (path === '/api/login' && req.method !== 'DELETE') {
    next();
    return;
  } else if (path === '/api/users' && req.method === 'POST') {
    next();
    return;
  } else if (path === '/api/users' && req.method === 'GET' && !hasToken) {
    next();
    return;
  } else if (path.includes('download')) {
    next();
    return;
  }

  let userId;

  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });
  if (Array.isArray(token))
    return res.status(400).json({ auth: false, message: 'Something is wrong with your token, please log in again' });

  jwt.verify(token, notSoSecret, function (err: any, decoded: any) {
    if (err) {
      return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    }

    userId = decoded.id;
  });

  if (userId) {
    try {
      const user = await User.findByById(userId);
      req.body.user = user;
      next();
    } catch (e) {
      res.status(400).json(e);
    }
  }
};
