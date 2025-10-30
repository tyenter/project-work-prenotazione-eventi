import { Request, Response, NextFunction } from 'express';
import { HttpError } from './errors';
import { MongoServerError } from 'mongodb';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof HttpError) 
    return res.status(err.statusCode).json({ error: err.message });

  if (err instanceof MongoServerError && err.code === 11000)
    return res.status(400).json({error: "invalid user info"})

  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
};