/**
 * User model module
 * @module models/user
 */
import { Model, model, Document, Schema } from 'mongoose';
import config from 'config';
import jwt from 'jsonwebtoken';

import { decrypt } from '../util/encryption';

const secret: string = config.get('secret');

export interface IUser {
  _id?: string;
  userName: string;
  email: string;
  password: string;
}

interface UserDocument extends Document {
  userName: string;
  email: string;
  password: string;
}

interface UserModel extends Model<UserDocument> {}

const userSchema = new Schema<UserDocument, UserModel>({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export class User {
  static model = model<UserDocument, UserModel>('User', userSchema);

  /**
   * Builds a User
   *
   * @param attr - {@link IUser}
   */
  static build(attr: IUser): UserDocument {
    return new this.model(attr);
  }

  /**
   * Find a User by userName
   *
   * @param {string} userName
   */
  static async findByUserName(userName: string): Promise<UserDocument | null> {
    return await this.model.findOne({ userName }).exec();
  }

  /**
   * Find a User by id
   *
   * @param _id - string
   */
  static async findById(_id: string): Promise<UserDocument | null> {
    return await this.model.findOne({ _id }).exec();
  }

  /**
   * Builds a new user and save
   * @param attr
   * @throws {Error}
   */
  static async createUser(attr: IUser): Promise<UserDocument | null> {
    const isExistingUser = Boolean(await this.findByUserName(attr.userName));
    if (isExistingUser) {
      throw { message: 'User already exists' };
    }
    const newUser = this.build(attr);
    return await newUser.save();
  }

  /**
   * Deletes a user
   * @param _id - string
   * @throws {Error}
   */
  static async deleteById(id: string) {
    return await this.model.deleteOne({ _id: id });
  }

  static validatePassword(user: IUser, password: string) {
    if (!password) {
      throw { message: 'Please write a password', status: 400 };
    }

    const decriptedPassword = decrypt(user.password, secret);

    if (password !== decriptedPassword) {
      throw { message: 'Wrong password', status: 400 };
    }

    return true;
  }

  static async validateUser(userName: string) {
    const user = await this.findByUserName(userName);

    if (!user) {
      throw { message: 'User not found', status: 400 };
    }

    return user;
  }

  static async generateJwt(id: string) {
    const user = await this.findById(id);
    if (user) {
      return jwt.sign(
        {
          email: user.email,
          id: user._id,
        },
        'secret',
        {
          expiresIn: '2 days',
        },
      );
    } else {
      throw { message: 'User not found', status: 400 };
    }
  }
}
