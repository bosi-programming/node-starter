import mongoose from 'mongoose';

export interface IImage {
  userId: string;
  imageName: string;
  image: string;
}

interface ImageModelInterface extends mongoose.Model<any> {
  build(attr: IImage): any;
}

const imageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  imageName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
});

imageSchema.statics.build = (attr: IImage) => {
  return new Image(attr);
};

export const Image = mongoose.model<any, ImageModelInterface>('Image', imageSchema);
