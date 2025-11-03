import { Router } from 'express';
import { EventsController } from '../controller/eventsController';
import { authenticateToken } from '../middleware/tokenVerifier';

const eventsRouter: Router = Router();
const eventsController = new EventsController();

eventsRouter.get('/', eventsController.getAllEvents);
eventsRouter.get('/:event_id', eventsController.getSingleEventById);

eventsRouter.post('/book',authenticateToken, eventsController.bookEvent)
eventsRouter.get('/book/check/:event_id',authenticateToken, eventsController.bookingCheck)

export default eventsRouter;