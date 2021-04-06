import mongoose from 'mongoose';

export interface IAuthor {
  firstName: string;
  lastName: string;
  abreviation: string;
}

interface AuthorModelInterface extends mongoose.Model<any> {
  build(attr: IAuthor): any;
}

const authorSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  abreviation: {
    type: String,
    required: true,
  },
});

authorSchema.statics.build = (attr: IAuthor) => {
  return new Author(attr);
};

export const Author = mongoose.model<any, AuthorModelInterface>('Author', authorSchema);
