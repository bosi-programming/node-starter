import express, { Request, Response } from 'express';

import { Media } from '../models/media';

const mediaRouter = express.Router();

mediaRouter.post('/api/media', async (req: Request, res: Response) => {
  const { mediaName, authorId, publisher, dateOfPublication, typeOfMedia, link } = req.body;

  const mediaExist = Boolean(await Media.findOne({ mediaName, authorId }));

  if (mediaExist) {
    res.status(400).json({ message: 'Mídia já existente em nosso sistema' });
    return;
  }

  try {
    const newMedia = Media.build({
      mediaName,
      authorId,
      publisher,
      dateOfPublication,
      typeOfMedia,
      link,
    });
    await newMedia.save();
    res.status(200).json(newMedia);
  } catch (e) {
    res.status(400).json(e);
  }
});

mediaRouter.get('/api/media', async (req: Request, res: Response) => {
  const { mediaName } = req.query;

  const medias = mediaName
    ? await Media.find({
        mediaName: { $regex: mediaName, $option: 'i' },
      })
    : await Media.find();

  if (medias.length === 0) {
    res.status(404).json({ message: 'Nenhuma mídia achada, crie uma mídia nova para vê-la aqui' });
  } else {
    res.status(200).json(medias);
  }
});

mediaRouter.get('/api/media/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const media = await Media.findOne({ _id: id });

  if (media.length === 0) {
    res.status(404).json({ message: 'Mídia não encontrada' });
  } else {
    res.status(200).json(media);
  }
});

export default mediaRouter;
