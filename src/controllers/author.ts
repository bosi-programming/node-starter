import express, { Request, Response } from 'express';

import { Author } from '../models/author';

const authorRouter = express.Router();

authorRouter.post('/api/author', async (req: Request, res: Response) => {
  const { firstName, lastName, abreviation } = req.body;

  const authorExist = Boolean(await Author.findOne({ firstName, lastName }));

  if (authorExist) {
    res.status(400).json({ message: 'Autor já existente em nosso sistema' });
    return;
  }

  try {
    const newAuthor = Author.build({
      firstName,
      lastName,
      abreviation,
    });
    await newAuthor.save();
    res.status(200).json(newAuthor);
  } catch (e) {
    res.status(400).json(e);
  }
});

authorRouter.get('/api/author', async (req: Request, res: Response) => {
  const { firstName, lastName } = req.query;

  const authors =
    firstName && lastName
      ? await Author.find({
          firstName: { $regex: firstName },
          lastName: { $regex: lastName },
        })
      : await Author.find();

  if (authors.length === 0) {
    res.status(404).json({ message: 'Nenhum autor achado, crie um autor nova para vê-lo aqui' });
  } else {
    res.status(200).json(authors);
  }
});

authorRouter.get('/api/author/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const author = await Author.findOne({ _id: id });

    if (author.length === 0) {
      res.status(404).json({ message: 'Autor não encontrado' });
    } else {
      res.status(200).json(author);
    }
  } catch (e) {
    res.status(404).json(e);
  }
});

authorRouter.delete('/api/author/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const author = await Author.deleteOne({ _id: id });

    if (author.deletedCount === 0) {
      res.status(404).json({ message: 'Autor não encontrado' });
    } else {
      res.status(200).json(author);
    }
  } catch (e) {
    res.status(404).json(e);
  }
});

export default authorRouter;
