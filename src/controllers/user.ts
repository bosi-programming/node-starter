import express, { Request, Response } from 'express';

import { encrypt } from '../util/encryption';
import { checkForExistingUser } from '../util/checkForExistingUser';

import { User } from '../models/user';

const userRouter = express.Router();

userRouter.post('/api/users', async (req, res) => {
  const { userName, authorName, role, mainAccount, password } = req.body;

  const hashedPassword = encrypt(password, 'banana');
  const isExistingUser = Boolean(await checkForExistingUser(userName));

  if (isExistingUser) {
    res.status(400).json({ message: 'User already exist in database' });
    return;
  }

  try {
    const newUser = User.build({ userName, authorName, role, mainAccount, password: hashedPassword });
    await newUser.save();
    res.status(200).json(newUser);
  } catch (e) {
    res.status(400).json(e);
  }
});

userRouter.get('/api/users', async (req, res) => {
  const { user } = req.body;

  if (user) {
    res.status(200).json({ logged: true, message: ' User logged in' });
  } else {
    res.status(200).json({ logged: false, message: 'User not logged or with old token' });
  }
});

userRouter.delete('/api/users', async (req, res) => {
  const { user, userName } = req.body;

  if (!user) {
    res.status(400).json({ message: 'Usuário não existe em nosso sistema' });
    return;
  }

  const userId = user._id;

  const deleteUser = await User.deleteOne({ _id: userId, userName });

  if (deleteUser.deletedCount === 0) {
    res.status(400).json({ message: 'Usuário não existe em nosso sistema' });
    return;
  }

  res.status(200).json({ ...deleteUser, message: 'Usuário deletado do sistema' });
});

export default userRouter;
