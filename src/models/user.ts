import mongoose from 'mongoose';

enum roleEnum {
  MAIN,
  WRITER,
}

export interface IUser {
  userName: string;
  authorName: string;
  role: roleEnum;
  mainAccount: string;
  password: string;
}

interface UserModelInterface extends mongoose.Model<any> {
  build(attr: IUser): any;
}

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['MAIN', 'WRITER'],
    required: true,
  },
  mainAccount: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.build = (attr: IUser) => {
  return new User(attr);
};

export const User = mongoose.model<any, UserModelInterface>('User', userSchema);

export const findUserById = async (_id: string) => await User.findOne({_id});
export const createUser = async (data: IUser) => await User.build(data).save();
export const deleteUserById = async (_id: string) => await User.deleteOne({_id});
