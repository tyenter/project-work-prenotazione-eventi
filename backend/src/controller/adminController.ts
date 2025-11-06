import { NextFunction, Request, Response } from 'express';
import { objectIdSchema } from './joiSchemas';
import { BadRequest } from '../errors/errors';
import { AdminService } from '../service/adminService';

export class AdminController {

    private adminService = new AdminService()

    public adminCheck = async (_: Request, res: Response): Promise<void>  => {
        res.sendStatus(200)
    }

    public removeSingleEventById = async (req: Request, res: Response, next: NextFunction): Promise<void>  => {
        try {
            const eventId: string | undefined = req.params.event_id

            const {error} = objectIdSchema.validate(eventId)
            if(error)
                throw new BadRequest("invalid id")

            await this.adminService.removeEventById(eventId!)

            res.status(200).json("OK")
        } catch(err){
            next()
        }
    }
}