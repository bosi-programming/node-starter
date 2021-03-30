import mongoose from 'mongoose';

enum todoStatus {
  NAOINICIADO,
  EMPROGRESSO,
  COMPLETO,
}

export interface ITodo {
  userId: string;
  userName: string;
  title: string;
  description: string;
  date: Date;
  status: todoStatus;
}

interface TodoModelInterface extends mongoose.Model<any> {
  build(attr: ITodo): any;
}

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['NAOINICIADO', 'EMPROGRESSO', 'COMPLETO'],
    required: false,
    default: 'NAOINICIADO',
  },
})

todoSchema.statics.build = (attr: ITodo) => {
  return new Todo(attr);
};

export const Todo = mongoose.model<any, TodoModelInterface>('Todo', todoSchema);
