import express, { Request, Response } from 'express';

import { verifyJWT } from '../util/verifyToken';
import { Todo } from '../models/todo';

const todoRouter = express.Router();

todoRouter.post('/api/todo', verifyJWT, async (req: Request, res: Response) => {
  const { title, description, date, status, user } = req.body;

  const userId = user._id;
  const userName = user.userName;

  const todoExist = Boolean(await Todo.findOne({ userId, title }));

  if (todoExist) {
    res.status(400).json({ message: 'Tarefa já existente em nosso sistema' });
    return;
  }

  const finalDate = new Date(date);
  const finalStatus = status || undefined;

  try {
    const newTodo = Todo.build({
      userId,
      userName,
      title,
      description,
      date: finalDate,
      status: finalStatus,
    });
    await newTodo.save();
    res.status(200).json(newTodo);
  } catch (e) {
    res.status(400).json(e);
  }
});

todoRouter.get('/api/todo', verifyJWT, async (req, res) => {
  const { user } = req.body;
  const userId = user._id;
  try {
    const todos = await Todo.find({ userId });
    res.status(200).json(todos);
  } catch (e) {
    res.status(400).json(e);
  }
});

todoRouter.delete('/api/todo', verifyJWT, async (req, res) => {
  const { user, title } = req.body;
  const userId = user._id;
  const deleteTodo = await Todo.deleteOne({ userId, title });

  if (deleteTodo.deletedCount === 0) {
    res.status(404).json({ message: 'Tarefa não encontrada' });
  } else {
    res.status(200).json({ ...deleteTodo, message: 'Tarefa deletada' });
  }
});

todoRouter.put('/api/todo', verifyJWT, async (req, res) => {
  const { title, newTitle, description, date, status, user } = req.body;
  const userId = user._id;
  const userName = user.userName;
  const todoExist = await Todo.find({ userId, title });

  if (!Boolean(todoExist)) {
    res.status(404).json({ message: 'Tarefa inexistente em nosso sistema' });
    return;
  }

  const finalDate = date ? new Date(date) : todoExist[0].data;
  const finalTitle = newTitle ? newTitle : title;
  const finalStatus = status ? status : todoExist[0].status;
  const finalDescription = description ? description : todoExist[0].description;

  try {
    const updateTodo = await Todo.findOneAndUpdate(
      { userId, title },
      {
        userId,
        userName,
        title: finalTitle,
        description: finalDescription,
        date: finalDate,
        status: finalStatus,
      },
    );
    res.status(200).json(updateTodo);
  } catch (e) {
    res.status(400).json(e);
  }
});

export default todoRouter;
