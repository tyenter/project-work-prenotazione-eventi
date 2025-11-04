import dotenv from 'dotenv';

dotenv.config(); 

export const PORT = process.env.PORT || '';
export const MONGO_URI = process.env.MONGO_URI || '';
export const DATABASE_NAME = process.env.DATABASE_NAME;
export const COLLECTION_EVENTI = process.env.COLLECTION_EVENTI || '';
export const COLLECTION_CREDS = process.env.COLLECTION_CREDS || '';
export const COLLECTION_BOOKINGS = process.env.COLLECTION_BOOKINGS || '';
export const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || '';
export const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || '';
