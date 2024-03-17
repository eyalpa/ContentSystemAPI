import { Request, Response } from 'express';
import { User } from '../../models/userModel';
import path from 'path';
import fs from 'fs';

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
export const getImage = async (req: Request, res: Response) => {
    try {
        const assetsDirectory = path.join(__dirname, '../../public/assets');
          const fileName = req.params.name;
          const filePath = path.join(assetsDirectory, fileName);
        
          // Check if the file exists before attempting to send it
          if (fs.existsSync(filePath)) {
            res.sendFile(filePath);
          } else {
            // If the file does not exist, send a 404 Not Found response
            res.status(404).send('File not found');
          }     
    } catch (error: any ) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};
