import { ObjectId, WithId } from 'mongodb';
import { COLLECTION_BOOKINGS, COLLECTION_EVENTI } from '../config';
import { connectDB } from '../db';
import { IBookings, IEvent, IEventsRes, IPagination, IEventsQuery } from '../models/models';
import { BadRequest, InternalServerError, NotFound } from '../errors/errors';

export class EventsService {
    
    public async getEvents(query: IEventsQuery): Promise<IEventsRes>{
        const db = await connectDB()
        const eventsColletion = db.collection<IEvent>(COLLECTION_EVENTI);

        const paginationFilled = {
            page: query.page ? Number(query.page) : 1,
            size: query.size ? Number(query.size) : 3,
        }

        const totElems = await eventsColletion.countDocuments()
        const totPages = Math.ceil(totElems / paginationFilled.size)

        const fullPagination: IPagination = {
            ...paginationFilled,
            totElems: totElems,
            totPages: totPages
        }

        let titleRegex = {}
        if(query.title){
            const nameEscaped = this.escapeRegex(query.title)
            const pattern = `^(${nameEscaped})|( ${nameEscaped})`
            titleRegex = {
                title: { 
                    $regex: RegExp(pattern),
                    $options: 'i' 
                }
            }
        }

        const events: IEvent[] = await eventsColletion
                            .find(titleRegex)
                            .sort({ date: -1 })
                            .skip((fullPagination.page - 1) * fullPagination.size)
                            .limit(fullPagination.size)
                            .toArray()

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

    public async bookEventForUser(eventId: string, people: number, userId: string): Promise <void>{
        const db = await connectDB()
        const bookingsCollection = db.collection<IBookings>(COLLECTION_BOOKINGS);

        const resp:  WithId<IBookings> | null = await bookingsCollection.findOne({userId})

        if(resp){
            if(resp.eventsBooked.find(ev => ev.eventId === eventId))
                throw new BadRequest("event already booked")

            const result = await bookingsCollection.updateOne(
                {userId}, 
                { $set: { eventsBooked: [{eventId,people}, ...resp.eventsBooked] } }
            )

            if(result.matchedCount === 0)
                throw new InternalServerError("internal server error")
        }
        else
            await bookingsCollection.insertOne({userId: userId, eventsBooked: [{eventId,people}]})
    }

    public async bookedCheck(eventId: string, userId: string): Promise <boolean>{
        const db = await connectDB()
        const bookingsCollection = db.collection<IBookings>(COLLECTION_BOOKINGS);

        const resp:  WithId<IBookings> | null = await bookingsCollection.findOne({userId})

        if(resp?.eventsBooked.find(ev => ev.eventId === eventId))
            return true

        return false
    }

    private escapeRegex(title: string):string {
        return title.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }

}
