import mongoose, { Schema, Document } from 'mongoose';
interface ICommunity extends Document {
    title: string;
    image: string;
    memberCount: number;
}

const communitySchema: Schema = new Schema({
    title: { type: String, required: true, maxlength: 60 },
    image: { type: String, required: true },
    memberCount: { type: Number, default: 0 }
});

export const Community = mongoose.model<ICommunity>('Community', communitySchema);
