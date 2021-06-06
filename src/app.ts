import express from 'express';
import config from 'config';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import passport from 'passport';

import loginRouter from './controllers/login';
import userRouter from './controllers/user';

import { verifyJWT } from './util/verifyToken';
import { connectToDataBase } from './mongoConnection';

import './passport.config';

const swaggerFile = require('./swagger_output.json');

const app: express.Application = express();
const port: number = config.get('port');
connectToDataBase();

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json({ limit: '10mb' }));
app.use(verifyJWT);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(loginRouter);
app.use(userRouter);

export const server = app.listen(port);

export default app;
