/**
 * User model module
 * @module models/user
 */
import { Model, model, Document, Schema } from 'mongoose';

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
      throw new Error('User already exists');
    }
    const newUser = this.build(attr);
    return await newUser.save();
  }

  /**
   * Deletes a user
   * @param _id - string
   * @throws {Error}
   */
  static async deleteById(attr: IUser) {
    new this.model(attr).validateSync();
    return await this.model.deleteOne({ _id: attr._id });
  }
}
