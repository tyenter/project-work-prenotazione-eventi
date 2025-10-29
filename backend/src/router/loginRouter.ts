import { Router } from 'express';
import { LoginController } from '../controller/loginController';

const loginRouter: Router = Router();
const loginController = new LoginController();

loginRouter.post('/', loginController.checkCreds);

export default loginRouter;