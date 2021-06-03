import express, { Request, Response } from 'express';

import { encrypt } from '../util/encryption';

import { User } from '../models/user';

const userRouter = express.Router();

userRouter.post('/api/users', async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;
  const hashedPassword = encrypt(password, 'banana');

  try {
    const newUser = await User.createUser({ userName, email, password: hashedPassword });
    res.status(200).json(newUser);
  } catch (e) {
    res.status(400).json(e);
  }
});

userRouter.get('/api/users', async (req: Request, res: Response) => {
  const { user } = req;

  if (user) {
    res.status(200).json({ logged: true, message: ' User logged in' });
  } else {
    res.status(200).json({ logged: false, message: 'User not logged or with old token' });
  }
});

userRouter.delete('/api/users', async (req: Request, res: Response) => {
  const { user } = req.body;
  console.log(user);

  try {
    const deleteUser = user;
    res.status(200).json({ ...deleteUser, message: 'User deleted from our system' });
  } catch (e) {
    res.status(400).json({ message: "User doesn't exist in our databse anymore" });
  }
});

export default userRouter;
