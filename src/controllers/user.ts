import express, { Request, Response } from 'express';
import config from 'config';

import { encrypt } from '../util/encryption';

import { User, IUser } from '../models/user';

const userRouter = express.Router();

const secret: string = config.get('secret');

userRouter.post('/api/users', async (req: Request, res: Response) => {
  /* #swagger.parameters['user'] = {
     in: 'body',
     type: 'object',
     required: true,
     type: 'string',
     schema: {
      userName: 'test',
      email: 'test@test.com',
      password: '1234567'
     }
    }
   */
  const { userName, email, password } = req.body;
  const hashedPassword = encrypt(password, secret);

  try {
    const newUser = await User.createUser({ userName, email, password: hashedPassword });
    res.status(200).json(newUser);
  } catch (e) {
    res.status(400).json(e);
  }
});

userRouter.get('/api/users', async (req: Request, res: Response) => {
  /* #swagger.security = [{
      "apiKeyAuth": []
     }] 
  */
  const { user } = req;

  if (user) {
    res.status(200).json({ logged: true, message: ' User logged in' });
  } else {
    res.status(200).json({ logged: false, message: 'User not logged or with old token' });
  }
});

userRouter.delete('/api/users', async (req: Request, res: Response) => {
  /* #swagger.security = [{
      "apiKeyAuth": []
     }] 
  */
  const user = req.user as IUser;

  try {
    if (user && user._id) {
      const deleteUser = User.deleteById(user._id);
      res.status(200).json({ ...deleteUser, message: 'User deleted from our system' });
      return;
    }

    throw new Error();
  } catch (e) {
    res.status(404).json({ message: "User doesn't exist in our databse anymore" });
  }
});

export default userRouter;
