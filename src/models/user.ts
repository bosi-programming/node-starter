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

interface UserModel extends Model<UserDocument> {
  build(attr: IUser): any;
  createUser(attr: IUser): any;
  deleteById(id: string): any;
  findByUserName(id: string): Promise<IUser>;
}

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
  static build(attr: IUser):UserDocument {
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
  static async findByById(_id: string): Promise<UserDocument | null> {
    return await this.model.findOne({ _id }).exec();
  }

  /**
   * Builds a new user and save
   * @param attr
   */
  static async createUser(attr: IUser): Promise<UserDocument | null> {
    const newUser = this.build(attr);
    return await newUser.save();
  }

  /**
   * Deletes a user
   * @param _id - string
   */
  static async deleteById(_id: string) {
    return await this.model.deleteOne({ _id });
  }
}
