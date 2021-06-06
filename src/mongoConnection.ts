import mongoose from 'mongoose';
import config from 'config';
import { decrypt } from './util/encryption';

const secret: string = config.get('secret');
const encryptedUrl: string = config.get('mongo.encryptedUrl');

const url = decrypt(encryptedUrl, secret);

export const connectToDataBase = () => {
  mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};
