import { MongoClient, Db } from 'mongodb';
import { DATABASE_NAME, MONGO_URI } from './config';

const client = new MongoClient(MONGO_URI);

let db: Db | null = null;

export const connectDB = async (): Promise<Db> => {
  if (db) return db; 

  await client.connect();
  db = client.db(DATABASE_NAME); 
  console.log('MongoDB connected');
  return db;
};