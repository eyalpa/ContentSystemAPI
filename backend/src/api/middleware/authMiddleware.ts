import {  Response, NextFunction,Request } from 'express';
import { IUser } from '../../interfaces/IUser';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // In a real-world scenario, you would authenticate the user here
    // For now, we'll just add a dummy user ID
    const userId = req.headers['x-user-id']?.toString() || '';

    const user: IUser = {
        _id: userId,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'super moderator',
        country: 'Israel',
        // ... other user properties
    };
    


    // Add the user to request locals
    req.user = user;
    next();
};
