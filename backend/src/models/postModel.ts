import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 60 },
  summary: String,
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  likes: { type: Number, default: 0 },
  status: { type: String, enum: ['Pending approval', 'Approved'], default: 'Pending approval' },
  createdAt: {
    type: Date,
    default: Date.now // This sets the default value to the current date and time
  }
});

export const Post = mongoose.model('Post', postSchema);
