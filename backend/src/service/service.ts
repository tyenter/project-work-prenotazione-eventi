import { ObjectId } from 'mongodb';
import { COLLECTION_EVENTI } from '../config';
import { connectDB } from '../db';
import { IEvent, IEventsRes, IPagination, IPaginationQuery } from '../models/models';
import { NotFound } from '../errors/errors';
import { errorHandler } from '../errors/errorHandler';

export class EventsService {
    
    public async getEvents(pagination: IPaginationQuery): Promise<IEventsRes>{
        const db = await connectDB()
        const eventsColletion = db.collection<IEvent>(COLLECTION_EVENTI);

        const paginationFilled = {
            page: pagination.page ? Number(pagination.page) : 1,
            size: pagination.size ? Number(pagination.size) : 3,
        }

        const totElems = await eventsColletion.countDocuments()
        const totPages = Math.ceil(totElems / paginationFilled.size)

        const fullPagination: IPagination = {
            ...paginationFilled,
            totElems: totElems,
            totPages: totPages
        }

        const events: IEvent[] = await eventsColletion
                            .find()
                            .skip((fullPagination.page - 1) * fullPagination.size)
                            .limit(fullPagination.size)
                            .toArray()
        // add sort by date

        return {
            data: events,
            pagination: fullPagination
        }

    }

    public async getEventById(id: string): Promise <IEvent>{
        const db = await connectDB()
        const eventsColletion = db.collection<IEvent>(COLLECTION_EVENTI);

        const eventId = new ObjectId(id)

        const event: IEvent | null = await eventsColletion
                                .findOne({_id: eventId})
        
        if(!event)
            throw new NotFound("event not found")

        return event as IEvent
    }

}
