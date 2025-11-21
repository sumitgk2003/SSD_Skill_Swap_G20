import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: false },
  meet: { type: mongoose.Schema.Types.ObjectId, ref: 'Meet', required: false },
  tutor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  learner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  durationInMinutes: { type: Number, required: true, default: 0 },
  completed: { type: Boolean, default: true },
  rating: { type: Number, min: 1, max: 5 },
  review: { type: String },
}, { timestamps: true });

export const Session = mongoose.model('Session', sessionSchema);
