import { NextFunction, Request, Response } from 'express';
import { credsSchema } from './joiSchemas';
import { BadRequest } from '../errors/errors';
import { LoginService } from '../service/loginService';


export class LoginController {

    private loginService = new LoginService()

    public checkCreds = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try{
            const body = req.body

            if(!req.body.email || !req.body.password)
                throw new BadRequest("email or password missing")

            const credentials = {
                email: req.body.email,
                password: req.body.password
            }
            const {error} = credsSchema.validate(credentials)
            if(error)
                throw new BadRequest("email or password don't meet requirements")

            await this.loginService.checkCredentials(credentials.email,credentials.password)

            // to-do cookie

            /*
            // generate token
            const token = jwt.sign(
                { userId: user._id, email: user.email },
                JWT_SECRET!,
                { expiresIn: "1h" }
            );

            // send token as HttpOnly cookie
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 3600000, 
            });
            */
            
            res.status(200).json("login successful") //tmp
        }catch(err){
            console.error("Error: ",err)
            next(err)
        }
    }
}