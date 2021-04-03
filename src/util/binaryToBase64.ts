import fs from 'fs';

const binaryToBase64 = (filePath: string) => {
  try {
    const file = fs.readFileSync(filePath, { encoding: 'base64' });
    fs.unlinkSync(filePath);
    return file;
  } catch (e) {
    return e;
  }
};

export default binaryToBase64;
