import jwt from 'jsonwebtoken';

import { notSoSecret } from '../app';
import { User } from '../models/user';

export const verifyJWT = async (req: any, res: any, next: any) => {
  const token = req.headers['x-access-token'];
  let userId;
  if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });

  jwt.verify(token, notSoSecret, function (err: any, decoded: any) {
    if (err) {
      return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    }

    userId = decoded.id;
  });
  const user = await User.findOne({ _id: userId });

  req.body.user = user;
  next();
};
