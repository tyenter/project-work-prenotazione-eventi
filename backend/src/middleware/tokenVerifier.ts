import { NextFunction, Router, Request, Response } from 'express';
import { JWT_ACCESS_SECRET } from '../config';
import jwt, {VerifyErrors} from "jsonwebtoken";


export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) 
        return res.sendStatus(401);

    jwt.verify(token, JWT_ACCESS_SECRET , (err, user) => {
        if (err) 
            return res.sendStatus(401); 
            
        req.user = user as {sub: string}; 

        next();
    });
}