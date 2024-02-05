import { Request, Response } from 'express';
import { User } from '../../models/userModel';

export const createUser = async (req: Request, res: Response) => {
    try {
        const newUser = new User(req.body);

        await newUser.save();
        res.status(201).json(newUser);
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
    } catch (error: any ) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
