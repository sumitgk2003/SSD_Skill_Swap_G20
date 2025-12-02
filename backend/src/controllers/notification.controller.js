import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Notification } from '../models/notification.model.js';
import { ApiError } from '../utils/ApiError.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const notifs = await Notification.find({ user: userId }).sort({ createdAt: -1 }).limit(50).lean();
  return res.status(200).json(new ApiResponse(200, notifs, 'Notifications fetched'));
});

export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) throw new ApiError(400, 'Notification id is required');
  const n = await Notification.findById(id);
  if (!n) throw new ApiError(404, 'Notification not found');
  if (String(n.user) !== String(req.user._id)) throw new ApiError(403, 'Not allowed');
  n.read = true;
  await n.save();
  return res.status(200).json(new ApiResponse(200, n, 'Marked read'));
});

export const markAllRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  await Notification.updateMany({ user: userId, read: false }, { $set: { read: true } });
  return res.status(200).json(new ApiResponse(200, {}, 'All notifications marked read'));
});
