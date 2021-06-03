import express, { Request, Response } from 'express';

import { User } from '../models/user';

const loginRouter = express.Router();

loginRouter.post('/api/login', async (req: Request, res: Response) => {
  const { userName, password } = req.body;
  try {
    const user = await User.validateUser(userName);
    User.validatePassword(user, password);

    const userId = user._id;
    const token = await User.generateJwt(userId);

    res.status(200).json({ token });
  } catch (e) {
    res.status(e.status).json(e);
  }
});

export default loginRouter;
