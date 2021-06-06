import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import { tokenOps } from '../passport.config';
import { IUser } from '../models/user';

const loginRouter = express.Router();

loginRouter.post('/api/login', passport.authenticate('login'), async (req: Request, res: Response) => {
  /* #swagger.parameters['user'] = {
     in: 'body',
     type: 'object',
     required: true,
     type: 'string',
schema: {
      username: 'test',
      password: '1234567'
     }
    }
   */
  const user = req.user as IUser;
  if (user) {
    const payload = { sub: user._id };
    const token = jwt.sign(payload, 'secret', tokenOps);
    res.json({ token });
  } else {
    res.status(400).json({ message: 'Error while login' });
  }
});

export default loginRouter;
