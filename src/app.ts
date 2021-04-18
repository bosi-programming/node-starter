import express from 'express';
import cors from 'cors';

import loginRouter from './controllers/login';
import userRouter from './controllers/user';

import { verifyJWT } from './util/verifyToken';
import { connectToDataBase } from './mongoConnection';

export const notSoSecret = 'banana';

const app: express.Application = express();
const port = process.env.PORT || 3000;
connectToDataBase();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(verifyJWT);

app.use(loginRouter);
app.use(userRouter);

export const server = app.listen(port);

export default app;
