import { Router } from 'express';
import { AuthController } from '../controller/authController';

const authRouter: Router = Router();
const authController = new AuthController();

authRouter.post('/login', authController.manageLogin);
authRouter.post('/refresh', authController.manageRefresh)
authRouter.post('/signup', authController.manageSignup)
authRouter.post('/logout', authController.manageLogout)

export default authRouter;