import express, { Request, Response } from 'express';
import multer from 'multer';

import binaryToBase64 from '../util/binaryToBase64';

const upload = multer({ dest: 'uploads/' });

const imageRouter = express.Router();

imageRouter.post('/api/image', upload.single('image'), (req: Request, res: Response) => {
  try {
    const image = binaryToBase64(`./uploads/${req.file.filename}`);

    res.status(201).json({ message: 'Image uploaded with success' });
  } catch (e) {
    res.status(400).json(e);
  }
});

export default imageRouter;
