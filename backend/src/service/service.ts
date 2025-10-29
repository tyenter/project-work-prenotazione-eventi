import { COLLECTION_EVENTI } from '../config';
import { connectDB } from '../db';
import { IEvent, IEventsRes, IPagination, IPaginationQuery } from '../models/models';

export class EventsService {
    
    public async getEvents(pagination: IPaginationQuery): Promise<IEventsRes | undefined>{
        try{
            const db = await connectDB()
            const eventi = db.collection<IEvent>(COLLECTION_EVENTI);

            const paginationFilled = {
                page: pagination.page ? Number(pagination.page) : 1,
                size: pagination.size ? Number(pagination.size) : 3,
            }

            const totElems = await eventi.countDocuments()
            const totPages = Math.ceil(totElems / paginationFilled.size)

            const fullPagination: IPagination = {
                ...paginationFilled,
                totElems: totElems,
                totPages: totPages
            }

            const events: IEvent[] = await eventi
                                .find()
                                .skip((fullPagination.page - 1) * fullPagination.size)
                                .limit(fullPagination.size)
                                .toArray()
            // add sort by date

            return {
                data: events,
                pagination: fullPagination
            }

        }catch (err) {
            console.error("ERROR: ",err)
        }
    }

    public async getEventById(){
        try{
            const db = await connectDB()
            const eventi = db.collection(COLLECTION_EVENTI);

            console.log(eventi)

        }catch (err) {
            console.error("ERROR: ",err)
        }
    }

}
