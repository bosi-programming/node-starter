/**
 * User model module
 * @module models/user
 */
import { Model, model, Document, Schema } from 'mongoose';

/**
 * User interface.
 *
 * @remarks
 *
 * The interface is componsed of an option _id of type string and obrigatory userName, email and password all of type string.
 */

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

  static build(attr: IUser) {
    return new this.model(attr);
  }

  static async findByUserName(userName: string) {
    return await this.model.findOne({ userName }).exec();
  }
  static async findByById(_id: string) {
    return await this.model.findOne({ _id }).exec();
  }
  static async createUser(attr: IUser) {
    const newUser = this.build(attr);
    return await newUser.save();
  }

  static async deleteById(_id: string) {
    return await this.model.deleteOne({ _id });
  }
}

/**
 * Creates the User model and its methods.
 *
 * @remarks
 *
 * This model has the methods build, createUser, findByUserName and deleteById.
 */
