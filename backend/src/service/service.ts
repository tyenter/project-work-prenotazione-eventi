import { MongoClient, Db } from 'mongodb';
import { COLLECTION_EVENTI, DATABASE_NAME, MONGO_URI } from '../config';

export class EventsService {

    private client = new MongoClient(MONGO_URI);
    
    public async getEvents(){
        try{
            await this.client.connect(); //TMP MAYBE OUTSIDE DONE 1 TIME
            const db: Db = this.client.db(DATABASE_NAME); //TMP MAYBE OUTSIDE DONE 1 TIME
            const eventi = db.collection(COLLECTION_EVENTI);

            const num = await eventi.countDocuments()
            console.log("[getAllEvents] NUMBER OF DOCS: ",num)

            const events = await eventi.find({}).toArray()
            console.log("events",events)

        }catch (err) {
            console.error("ERROR: ",err)
        }
    }

}
