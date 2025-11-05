import { Router } from 'express';
import { AdminController } from '../controller/adminController';

const adminRouter: Router = Router();
const adminController = new AdminController();

adminRouter.post('/', adminController.adminCheck);
adminRouter.post('/remove-event/:event_id', adminController.removeSingleEventById);

export default adminRouter;