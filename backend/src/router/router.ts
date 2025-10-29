import { Router } from 'express';
import { EventsController } from '../controller/controller';

const eventsRouter: Router = Router();
const eventsController = new EventsController();

eventsRouter.get('/', eventsController.getAllEvents);
eventsRouter.get('/:event_id', eventsController.getSingleEventById);

export default eventsRouter;