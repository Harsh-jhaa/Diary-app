import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    minlength: [10, 'Content must be at least 10 characters'],
  },
  privacy: {
    type: String,
    enum: ['private', 'public'],
    default: 'private',
  },
  mood: {
    type: String,
    enum: [
      'happy',
      'sad',
      'neutral',
      'excited',
      'grateful',
      'anxious',
      'angry',
    ],
    default: 'neutral',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// creating indexes 
entrySchema.index({userId: 1, createdAt: -1});
entrySchema.index({privacy: 1, createdAt: -1});

export default mongoose.model('Entry', entrySchema);