import { User } from '../models/user';


export const validateUser = async (userName: string) => {
  const user = await User.findByUserName(userName);

  if (!user) {
    throw { message: 'User not found', status: 400 };
  }

  return user;
}

