import express from 'express';
import bodyParser from 'body-parser';

import loginRouter from './controllers/login';
import todoRouter from './controllers/todo';
import userRouter from './controllers/user';
import postRouter from './controllers/post';

import { connectToDataBase } from './mongoConnection';

export const notSoSecret = 'banana';

const app: express.Application = express();
const port = process.env.PORT || 3000;
connectToDataBase();

app.use(bodyParser.json());

app.use(loginRouter);
app.use(userRouter);
app.use(todoRouter);
app.use(postRouter);

export const server = app.listen(port);

export default app;
