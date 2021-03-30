import mongoose from 'mongoose';

export interface IPost {
  userId: string;
  authorName: string;
  authorUserName: string;
  mainAccount: string;
  date: Date;
  title: string;
  content: string;
}

interface PostModelInterface extends mongoose.Model<any> {
  build(attr: IPost): any;
}

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorUserName: {
    type: String,
    required: true,
  },
  mainAccount: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: false,
  },
});

postSchema.statics.build = (attr: IPost) => {
  return new Post(attr);
};

export const Post = mongoose.model<any, PostModelInterface>('Post', postSchema);
