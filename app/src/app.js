import express from 'express';
import cors from 'cors';
import api from './routes/api.js';
import home from './routes/home.js';
import error from './routes/error.js';
import sse from './routes/sse.js';
import { errorLogger, errorResponder, invalidPathHandler } from './middleware/errorHandler.js';
import authenticator from './middleware/authenticator.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/monitors', authenticator);

app.use('/', home);
app.use('/api', api);
app.use('/error', error);
app.use('/sse', sse);

app.use(errorLogger);
app.use(errorResponder);
app.use(invalidPathHandler);

export default app;
