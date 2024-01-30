import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import postRoutes from './api/routes/postRoutes';
import userRoutes from './api/routes/userRoutes';
import communityRoutes from './api/routes/communityRoutes';

import { authMiddleware } from './api/middleware/authMiddleware';

// Load environment variables from .env file
dotenv.config();

const app: Application = express();

// MongoDB Connection URI
const mongoUri: string = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;

const options = { dbName: process.env.DB_NAME,
user: process.env.DB_USER,
pass: encodeURIComponent(process.env.DB_PASSWORD || ''),
autoIndex: true,
autoCreate: true
}
// Connect to MongoDB
mongoose.connect(mongoUri, options).then(() => console.log('Connected to MongoDB'))
.catch((err:any) => console.error('Could not connect to MongoDB', err));

// Middlewares
app.use(bodyParser.json());
app.use(authMiddleware);

// Routes
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/community', communityRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Content System Server is running!');
});

app.use((err: any, req: Request, res: Response, next: Function) => {
    console.error(err.message);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;
