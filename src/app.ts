import express from 'express';
import cors from 'cors';

import loginRouter from './controllers/login';
import todoRouter from './controllers/todo';
import userRouter from './controllers/user';
import postRouter from './controllers/post';
import imageRouter from './controllers/image';
import authorRouter from './controllers/author';
import mediaRouter from './controllers/media';
import quoteRouter from './controllers/quote';

import { verifyJWT } from './util/verifyToken';
import { connectToDataBase } from './mongoConnection';

export const notSoSecret = 'banana';

const app: express.Application = express();
const port = process.env.PORT || 3000;
connectToDataBase();

app.use(cors());
app.use(express.json());
app.use(verifyJWT);

app.use(loginRouter);
app.use(userRouter);
app.use(todoRouter);
app.use(postRouter);
app.use(imageRouter);
app.use(authorRouter);
app.use(mediaRouter);
app.use(quoteRouter);

export const server = app.listen(port);

export default app;
