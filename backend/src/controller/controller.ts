import { Request, Response } from 'express';
import { EventsService } from '../service/service';

export class EventsController {

    private eventsService = new EventsService()

    public getAllEvents = (_: Request, res: Response) => {
        try{
            this.eventsService.getEvents()

            res.json("placeholder")
        }catch(err){
            console.error("ERROR: ",err)
        }
        
    }

    public getEventById(_: Request, res: Response) {
        //const user = userService.getUserById(req.params.id);
        //if (!user) return res.status(404).json({ message: 'User not found' });
        //res.json(user);
        res.json({message: "you visited /eventi/:id"})
    }
}