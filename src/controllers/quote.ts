import express, { Request, Response } from 'express';

import { Quote } from '../models/quote';

const quoteRouter = express.Router();

quoteRouter.post('/api/quote', async (req: Request, res: Response) => {
  const { authorId, mediaId, where, content } = req.body;

  const quoteExist = Boolean(await Quote.findOne({ authorId, mediaId, where, content }));

  if (quoteExist) {
    res.status(400).json({ message: 'Citação já existente em nosso sistema' });
    return;
  }
});

quoteRouter.get('/api/quote', async (req: Request, res: Response) => {
  const { content } = req.query;

  const quotes = content
    ? await Quote.find({
        content: { $regex: content, $option: 'i' },
      })
    : await Quote.find();

  if (quotes.length === 0) {
    res.status(404).json({ message: 'Nenhuma citação achada, crie uma citação nova para vê-la aqui' });
  } else {
    res.status(200).json(quotes);
  }
});

quoteRouter.get('/api/quote/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const quote = await Quote.findOne({ _id: id });

  if (quote.length === 0) {
    res.status(404).json({ message: 'Citação não encontrada' });
  } else {
    res.status(200).json(quote);
  }
});

export default quoteRouter;
