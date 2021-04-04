import { Response } from 'express';
import fs from 'fs';

const base64ToBinary = (image: string, filePath: string, res: Response) => {
  fs.writeFile(filePath, image, { encoding: 'base64' }, (e) => {
    if (e) {
      res.status(400).json({ message: 'Error trying to get image', error: e });
    } else {
      sendFile(filePath, res);
    }
  });
};

const sendFile = (filePath: string, res: Response) => {
  res.status(200).sendFile(filePath, { headers: { 'Content-Type': 'image/any' } }, (e) => {
    if (e) {
      res.status(400).json({ message: 'Error trying to get image', error: e });
    } else {
      fs.unlinkSync(filePath);
    }
  });
};

export default base64ToBinary;
