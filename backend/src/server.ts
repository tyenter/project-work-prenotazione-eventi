import express from 'express';
import {PORT} from './config'
import eventsRouter from './router/router';
import { errorHandler } from './errors/errorHandler';

const app = express();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/eventi", eventsRouter)

app.use(errorHandler)