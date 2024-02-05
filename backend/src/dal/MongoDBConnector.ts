import mongoose from 'mongoose';
import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

export type LeanOrFull<T, Lean extends boolean> = Lean extends true ? T : T & Document;

class MongoDBConnector {
    private static instance: MongoDBConnector;
    private connectionString: string;
    private options: any ;
    private constructor() {
        // MongoDB Connection URI
        this.connectionString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}`;

        this.options = { dbName: process.env.DB_NAME,
            user: process.env.DB_USER,
            pass: encodeURIComponent(process.env.DB_PASSWORD || ''),
            autoIndex: true,
            autoCreate: true
            };

    }

    public static getInstance(): MongoDBConnector {
        if (!MongoDBConnector.instance) {
            MongoDBConnector.instance = new MongoDBConnector();
            MongoDBConnector.instance.connect();
        }
        return MongoDBConnector.instance;
    }

    private connect(): void {
        mongoose.connect(this.connectionString, this.options)
            .then(() => console.log('MongoDB connected'))
            .catch(err => console.error('MongoDB connection error:', err));
    }

    // Add any other MongoDB interactions you need as methods here
}

export default MongoDBConnector;
