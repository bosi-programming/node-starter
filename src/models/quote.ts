import mongoose from 'mongoose';

export interface IQuote {
  authorId: string;
  mediaId: string;
  where: string;
  content: string;
}

interface QuoteModelInterface extends mongoose.Model<any> {
  build(attr: IQuote): any;
}

const quoteSchema = new mongoose.Schema({
  authorId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  mediaId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  where: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

quoteSchema.statics.build = (attr: IQuote) => {
  return new Quote(attr);
};

export const Quote = mongoose.model<any, QuoteModelInterface>('Qoute', quoteSchema);
