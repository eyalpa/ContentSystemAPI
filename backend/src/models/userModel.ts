import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  role?: "super moderator" | "moderator";
  email?: string;
  password?: string; // Add password field
  image?: string;
  country: string;
  communities: Schema.Types.ObjectId[];
}

const userSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, enum: ["super moderator", "moderator"] },
  email: { type: String, unique: true, required: true }, // Ensure email is unique and required
  password: { type: String, required: true }, // Add password field
  image: { type: String },
  country: { type: String, required: true },
  communities: [{ type: Schema.Types.ObjectId, ref: "Community" }],
});

export const User = mongoose.model<IUser>("User", userSchema);
