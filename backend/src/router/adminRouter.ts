import { Router } from 'express';
import { AdminController } from '../controller/adminController';
import { authenticateToken } from '../middleware/tokenVerifier';

const adminRouter: Router = Router();
const adminController = new AdminController();

adminRouter.post('/',authenticateToken, adminController.placeholder); //tmp

export default adminRouter;