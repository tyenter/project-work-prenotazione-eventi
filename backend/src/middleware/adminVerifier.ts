import { Request, Response, NextFunction } from 'express';
import { TokenInfo } from '../types/express';

export const authenticateAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user: TokenInfo | undefined = req.user;

    if (user?.role !== 'admin')
        return res.sendStatus(403)

    next();
};
