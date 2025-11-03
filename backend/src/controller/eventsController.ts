import { NextFunction, Request, Response } from 'express';
import { EventsService } from '../service/eventsService';
import { IEvent, IEventsRes, IPaginationQuery } from '../models/models';
import { bookEventSchema, objectIdSchema, paginationSchema } from './joiSchemas';
import { BadRequest, InternalServerError } from '../errors/errors';


export class EventsController {

    private eventsService = new EventsService()

    public getAllEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const pagination: IPaginationQuery = req.query

            const {error} = paginationSchema.validate(pagination)
            if(error)
                throw new BadRequest("invalid parameters")
            
            const events: IEventsRes = await this.eventsService.getEvents(pagination)

            res.status(200).json(events)
        }catch(err){
            console.error("Event Error: ",err)
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
            console.error("Event Error: ",err)
            next(err)
        }
    }

    public bookEvent = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {eventId,people} = req.body

            const {error} = bookEventSchema.validate({eventId,people},{ stripUnknown: true })
            if(error)
                throw new BadRequest("invalid body")

            const userId: string | undefined = req.user?.sub
            if(!userId)
                throw new BadRequest("invalid user id")

            await this.eventsService.bookEventForUser(eventId, people, userId)

            res.status(200).json("booking successful")
        }catch(err){
            console.error("Booking Error: ",err)
            next(err)
        }
    }

    public bookingCheck = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const {eventId} = req.body

            const {error} = objectIdSchema.validate(eventId,{ stripUnknown: true })
            if(error)
                throw new BadRequest("invalid event id")

            const userId: string | undefined = req.user?.sub
            if(!userId)
                throw new BadRequest("invalid user id")

            const isBooked = await this.eventsService.bookedCheck(eventId, userId)

            res.status(200).json({isBooked})
        }catch(err){
            console.error("Booking Error: ",err)
            next(err)
        }
    }

}