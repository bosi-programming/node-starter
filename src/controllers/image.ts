import express, { Request, Response } from 'express';
import multer from 'multer';

import { verifyJWT } from '../util/verifyToken';
import binaryToBase64 from '../util/binaryToBase64';
import base64ToBinary from '../util/base64ToBinary';
import { Image } from '../models/image';

const upload = multer({ dest: 'uploads/' });

const imageRouter = express.Router();

imageRouter.post('/api/image', upload.single('image'), verifyJWT, async (req: Request, res: Response) => {
  try {
    const { imageName, user } = req.body;
    const userId = user._id;

    const imageExist = Boolean(await Image.findOne({ userId, imageName }));

    if (imageExist) {
      res.status(400).json({ message: 'Imagem já existente em nosso sistema' });
      return;
    }

    const image = binaryToBase64(`./uploads/${req.file.filename}`);

    const newImage = Image.build({ userId, imageName, image });

    await newImage.save();

    res.status(201).json({ newImage });
  } catch (e) {
    res.status(400).json(e);
  }
});

imageRouter.get('/api/image', async (req: Request, res: Response) => {
  const { user } = req.body;
  const userId = user._id;
  const { imageName } = req.query;

  const images = imageName ? await Image.findOne({ userId, imageName }) : await Image.find({ userId });

  if (images.length === 0) {
    res.status(404).json({ message: 'Nenhuma imagem encontrada em nosso sistema' });
    return;
  }

  res.status(200).json(images);
});

imageRouter.get('/api/image/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;

  const userId = user._id;

  const image = await Image.findOne({ _id: id, userId });

  if (image.length === 0) {
    res.status(404).json({ message: 'Nenhuma imagem encontrada em nosso sistema' });
    return;
  }

  const filePath = `${process.cwd()}/uploads/${image._id}`;
  try {
    base64ToBinary(image.image, filePath, res);
  } catch (e) {
    res.status(200).json(e);
  }
});

imageRouter.delete('/api/image/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { user } = req.body;

  const userId = user._id;

  try {
    const deletedImage = await Image.deleteOne({ _id: id, userId });
    res.status(200).json(deletedImage);
  } catch (e) {
    res.status(404).json(e);
  }
});

export default imageRouter;
