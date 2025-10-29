import express from 'express';
import {PORT} from './config'
import eventsRouter from './router/eventsRouter';
import { errorHandler } from './errors/errorHandler';
import loginRouter from './router/loginRouter';

const app = express();

/*
app.use(cors({
  origin: "http://localhost:3001", // frontend url
  credentials: true                
}));
app.use(cookieParser());           // per cookies
*/

app.use(express.json()); 

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/eventi", eventsRouter)
app.use("/login", loginRouter)

app.use(errorHandler)