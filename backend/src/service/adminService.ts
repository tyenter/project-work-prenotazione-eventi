import { ObjectId } from 'mongodb';
import { COLLECTION_EVENTI } from '../config';
import { connectDB } from '../db';
import { IEvent } from '../models/models';
import { NotFound } from '../errors/errors';

export class AdminService {

    public async removeEventById(id: string): Promise <void>{
        const db = await connectDB()
        const eventsCollection = db.collection<IEvent>(COLLECTION_EVENTI);

        const eventId = new ObjectId(id)
        
        const result = await eventsCollection.deleteOne({ _id: eventId });

        if(result.deletedCount === 0)
            throw new NotFound("Event not found")
    }
}
