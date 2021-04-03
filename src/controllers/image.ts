import express, { Request, Response } from 'express';
import multer from 'multer';

import binaryToBase64 from '../util/binaryToBase64';

const upload = multer({ dest: 'uploads/' });

const imageRouter = express.Router();

imageRouter.post('/api/image', upload.single('image'), (req: Request, res: Response) => {
  const image = binaryToBase64(`./uploads/${req.file.filename}`);

  console.log(image);
  res.json({ image });
});

export default imageRouter;
