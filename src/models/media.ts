import mongoose from 'mongoose';

enum EnumMedia {
  BOOK,
  ARTICLE,
  BLOGPOST,
  MOVIE,
  WEBVIDEO,
}

export interface IMedia {
  mediaName: string;
  authorId: string;
  publisher?: string;
  dateOfPublication: Date;
  typeOfMedia: EnumMedia;
  link?: string;
}

interface MediaModelInterface extends mongoose.Model<any> {
  build(attr: IMedia): any;
}

const mediaSchema = new mongoose.Schema({
  mediaName: {
    type: String,
    required: true,
  },
  authorId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  publisher: {
    type: String,
    required: false,
  },
  dateOfPublication: {
    type: Date,
    required: true,
  },
  typeOfMedia: {
    type: String,
    enum: ['BOOK', 'ARTICLE', 'BLOGPOST', 'MOVIE', 'WEBVIDEO'],
    required: true,
  },
});

mediaSchema.statics.build = (attr: IMedia) => {
  return new Media(attr);
};

export const Media = mongoose.model<any, MediaModelInterface>('Media', mediaSchema);
