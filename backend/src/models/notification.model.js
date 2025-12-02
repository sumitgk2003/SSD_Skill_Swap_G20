import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // who triggered
  type: { type: String, required: true }, // e.g., 'meet.created', 'meet.rescheduled', 'match.request'
  title: { type: String, required: true },
  body: { type: String, default: '' },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  read: { type: Boolean, default: false },
}, {
  timestamps: true
});

export const Notification = mongoose.model('Notification', notificationSchema);
