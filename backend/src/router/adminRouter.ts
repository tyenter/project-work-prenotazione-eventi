import { Router } from 'express';
import { AdminController } from '../controller/adminController';
import { NextFunction, Request, Response } from 'express';

const adminRouter: Router = Router();
const adminController = new AdminController();

adminRouter.post('/', async (_: Request, res: Response): Promise<void>  => {
    res.status(200).json("OK")
});

export default adminRouter;