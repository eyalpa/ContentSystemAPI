import mongoose, { Schema, Document } from 'mongoose';


export interface IUser extends Document {

    name: string;
    role?: 'super moderator' | 'moderator';
    email?: string;
    image?: string;
    country: string;
    communities: Schema.Types.ObjectId[];
}

const userSchema: Schema = new Schema({
    name: { type: String, required: true },
    role: { type: String, enum: ['super moderator', 'moderator'] },
    email: { type: String },
    image: { type: String },
    country: { type: String, required: true },
    communities: [{ type: Schema.Types.ObjectId, ref: 'Community' }]
});

export const User = mongoose.model<IUser>('User', userSchema);
