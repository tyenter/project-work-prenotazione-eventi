import { MongoClient, Db } from 'mongodb';
import { COLLECTION_CREDS, DATABASE_NAME, MONGO_URI } from './config';

const client = new MongoClient(MONGO_URI);

let db: Db | null = null;

export const connectDB = async (): Promise<Db> => {
  if (db) return db; 

  await client.connect();
  db = client.db(DATABASE_NAME); 
  const credsCollection = db.collection(COLLECTION_CREDS)
  await credsCollection.createIndex({ email: 1 }, { unique: true });

  console.log('MongoDB connected');
  return db;
};