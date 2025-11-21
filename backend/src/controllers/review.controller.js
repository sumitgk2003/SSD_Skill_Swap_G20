import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Session } from "../models/session.model.js";
import { Match } from "../models/match.model.js";
import { User } from "../models/user.model.js";
import mongoose from 'mongoose';

// Create a review for a user (optionally tied to a session)
export const createReview = asyncHandler(async (req, res) => {
  const { sessionId, toUserId, rating, text } = req.body;
  const fromUserId = req.user._id;

  if (!toUserId || !rating) throw new ApiError(400, 'toUserId and rating required');
  if (!mongoose.Types.ObjectId.isValid(toUserId)) throw new ApiError(400, 'Invalid toUserId');

  // Basic validation: ensure fromUser and toUser were connected via an accepted match or a session
  let allowed = false;
  if (sessionId && mongoose.Types.ObjectId.isValid(sessionId)) {
    const session = await Session.findById(sessionId).lean();
    if (session && (String(session.tutor) === String(fromUserId) || String(session.learner) === String(fromUserId))) {
      // ensure toUser is the other participant
      if (String(session.tutor) === String(toUserId) || String(session.learner) === String(toUserId)) allowed = true;
    }
  } else {
    // check accepted match exists between users
    const match = await Match.findOne({
      $or: [
        { user1: fromUserId, user2: toUserId },
        { user1: toUserId, user2: fromUserId },
      ],
      status: 'accepted'
    }).lean();
    if (match) allowed = true;
  }

  if (!allowed) throw new ApiError(403, 'You may only review users you have matched or shared sessions with');

  const review = await Review.create({ session: sessionId || undefined, fromUser: fromUserId, toUser: toUserId, rating, text });
  return res.status(201).json(new ApiResponse(201, review, 'Review created'));
});

export const getReviewsForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new ApiError(400, 'Invalid userId');
  const reviews = await Review.find({ toUser: userId }).populate('fromUser', 'name').sort({ createdAt: -1 }).lean();
  return res.status(200).json(new ApiResponse(200, reviews, 'Reviews fetched'));
});

export const getAverageRating = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(userId)) throw new ApiError(400, 'Invalid userId');
  const agg = await Review.aggregate([
    { $match: { toUser: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);
  const avg = (agg[0] && agg[0].avgRating) ? Number(agg[0].avgRating.toFixed(2)) : null;
  const count = (agg[0] && agg[0].count) || 0;
  return res.status(200).json(new ApiResponse(200, { avg, count }, 'Average rating'));
});
