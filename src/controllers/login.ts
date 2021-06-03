import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import { tokenOps } from '../passport.config';

const loginRouter = express.Router();

loginRouter.post('/api/login', passport.authenticate('login'), async (req: Request, res: Response) => {
  const { user } = req;
  if (user) {
    // @ts-ignore
    const payload = { sub: user._id };
    const token = jwt.sign(payload, 'secret', tokenOps);
    res.json({ token });
  } else {
    res.status(400).json({ message: 'Error while login' });
  }
});

export default loginRouter;
