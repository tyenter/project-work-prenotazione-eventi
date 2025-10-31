import express from 'express';
import {PORT} from './config'
import eventsRouter from './router/eventsRouter';
import { errorHandler } from './errors/errorHandler';
import authRouter from './router/authRouter';
import fs from "fs";
import https from "https";
import helmet from 'helmet';
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

app.use(helmet()); // per sicurezza HTTP headers
app.use(express.json()); 
app.use(cookieParser());

// uso self-signed certificate perchè non siamo in production
// altrimenti si potrebbe usare nginx + let's encrypt 
const options = {
  key: fs.readFileSync("certs/server.key"),
  cert: fs.readFileSync("certs/server.crt"),
};

https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS server running on https://localhost:${PORT}`);
});


app.use(cors({
  origin: "https://localhost:5173", 
  credentials: true                
}));


app.use("/eventi", eventsRouter)
app.use("/auth", authRouter)

app.use(errorHandler)