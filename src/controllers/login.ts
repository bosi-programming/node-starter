import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { notSoSecret } from '../app';
import { decrypt } from '../util/encryption';
import { validateUser } from '../util/validateUser';

import { IUser } from '../models/user';

const loginRouter = express.Router();

loginRouter.post('/api/login', async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await validateUser(userName);
    validatePassword(user, password);

    const userId = user._id;
    const token = jwt.sign({ id: userId }, notSoSecret, {
      expiresIn: '2 days',
    });

    res.status(200).json({ token });
  } catch (e) {
    res.status(e.status).json(e);
  }
});

const validatePassword = (user: IUser, password: string) => {
  if (!password) {
    throw { message: 'Please write a password', status: 400 };
  }

  const decriptedPassword = decrypt(user.password, 'banana');

  if (password !== decriptedPassword) {
    throw { message: 'Wrong password', status: 400 };
  }
};

export default loginRouter;
