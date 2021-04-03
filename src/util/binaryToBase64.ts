import fs from 'fs';

const binaryToBase64 = (filePath: string) => {
  return fs.readFileSync(filePath, { encoding: 'base64' });
};

export default binaryToBase64;
