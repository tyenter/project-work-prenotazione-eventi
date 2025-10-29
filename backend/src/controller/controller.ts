import { NextFunction, Request, Response } from 'express';
import { EventsService } from '../service/service';
import { IPaginationQuery } from '../models/models';
import { paginationSchema } from './joiSchema';
import { BadRequest, InternalServerError } from '../errors/errors';


export class EventsController {

    private eventsService = new EventsService()

    public getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
        try{
            const pagination: IPaginationQuery = req.query

            const {error} = paginationSchema.validate(pagination)
            if(error)
                throw new BadRequest("invalid parameters")
            
            const events = await this.eventsService.getEvents(pagination)

            if(events === undefined)
                throw new InternalServerError("internal server error")

            res.json(events)

        }catch(err){
            console.error("Error: ",err)
            next(err)
        }
    }

    public getEventById(req: Request, res: Response, next: NextFunction) {
        try{
            const id: string | undefined = req.params.event_id
            
            // to-do: controllo validità id (esadecimale 24?)

            // this.eventsService.getEventById()

            res.json("you visited /eventi/:id")
        }catch(err){
            console.error("ERROR: ",err)
            next(err)
        }
    }
}