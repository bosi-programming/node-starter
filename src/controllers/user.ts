import express, { Request, Response } from 'express';

import { encrypt } from '../util/encryption';
import { checkForExistingUser } from '../util/checkForExistingUser';

import { User } from '../models/user';

const userRouter = express.Router();

userRouter.post('/api/users', async (req, res) => {
  const { userName, authorName, role, mainAccount, password } = req.body;

  const hashedPassword = encrypt(password, 'banana');
  try {
    const newUser = User.build({ userName, authorName, role, mainAccount, password: hashedPassword });
    const isExistingUser = Boolean(await checkForExistingUser(userName));

    if (isExistingUser) {
      throw { message: 'User already exist in our database', status: 400 };
    }
    await newUser.save();
    res.status(200).json(newUser);
  } catch (e) {
    res.status(400).json(e);
  }
});

userRouter.delete('/api/users', async (req, res) => {
  const { userId, userName } = req.body;

  const deleteUser = await User.deleteOne({ _id: userId, userName });

  if (deleteUser.deletedCount === 0) {
    res.status(400).json({ message: 'Usuário não existe em nosso sistema' });
    return;
  }

  res.status(200).json({ ...deleteUser, message: 'Usuário deletado do sistema' });
});

export default userRouter;
