import { Router } from 'express';
import { EventsController } from '../controller/eventsController';
import { authenticateToken } from '../controller/tokenVerifier';

const eventsRouter: Router = Router();
const eventsController = new EventsController();

eventsRouter.get('/', eventsController.getAllEvents);
eventsRouter.get('/:event_id', eventsController.getSingleEventById);

eventsRouter.post('/book',authenticateToken, eventsController.bookEvent)

export default eventsRouter;