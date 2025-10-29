import { NextFunction, Request, Response } from 'express';
import { EventsService } from '../service/service';
import { IEvent, IEventsRes, IPaginationQuery } from '../models/models';
import { objectIdSchema, paginationSchema } from './joiSchema';
import { BadRequest, InternalServerError } from '../errors/errors';


export class EventsController {

    private eventsService = new EventsService()

    public getAllEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const pagination: IPaginationQuery = req.query

            const {error} = paginationSchema.validate(pagination)
            if(error)
                throw new BadRequest("invalid parameters")
            
            const events: IEventsRes | undefined = await this.eventsService.getEvents(pagination)

            if(events === undefined)
                throw new InternalServerError("internal server error")

            res.status(200).json(events)

        }catch(err){
            console.error("Error: ",err)
            next(err)
        }
    }

    public getSingleEventById = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const id: string | undefined = req.params.event_id
            
            const {error} = objectIdSchema.validate(id)
            if(error)
                throw new BadRequest("invalid id")

            const event: IEvent | undefined = await this.eventsService.getEventById( id! )

            res.status(200).json(event)
        }catch(err){
            console.error("ERROR: ",err)
            next(err)
        }
    }
}