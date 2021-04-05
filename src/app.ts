import express from 'express';

import loginRouter from './controllers/login';
import todoRouter from './controllers/todo';
import userRouter from './controllers/user';
import postRouter from './controllers/post';
import imageRouter from './controllers/image';

import { verifyJWT } from './util/verifyToken';
import { connectToDataBase } from './mongoConnection';

export const notSoSecret = 'banana';

const app: express.Application = express();
const port = process.env.PORT || 3000;
connectToDataBase();

app.use(express.json());
app.use(verifyJWT);
  
app.use(loginRouter);
app.use(userRouter);
app.use(todoRouter);
app.use(postRouter);
app.use(imageRouter);

export const server = app.listen(port);

export default app;
