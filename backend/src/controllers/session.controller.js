import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Session } from "../models/session.model.js";
import { Review } from "../models/review.model.js";
import { User } from "../models/user.model.js";
import { Meet } from "../models/meet.model.js";
import { Match } from "../models/match.model.js";
import mongoose from 'mongoose';

// Record a completed session (or create session record)
export const createSession = asyncHandler(async (req, res) => {
  // Debug: log incoming body and content-type to diagnose missing-field errors
  try {
    console.log('createSession called. Content-Type:', req.headers['content-type']);
    console.log('createSession req.body:', JSON.stringify(req.body));
  } catch (e) {
    console.error('Failed to stringify req.body for debug', e);
  }

  const { matchId, meetId, tutorId, learnerId, date, durationInMinutes, rating, review } = req.body;

  if (!tutorId || !learnerId || !date || !durationInMinutes) {
    throw new ApiError(400, 'tutorId, learnerId, date and durationInMinutes are required');
  }

  // Basic validation of ObjectIds
  if (!mongoose.Types.ObjectId.isValid(tutorId) || !mongoose.Types.ObjectId.isValid(learnerId)) {
    throw new ApiError(400, 'Invalid user id(s)');
  }

  // Ensure the requester is one of the participants
  const requesterId = req.user._id;
  if (String(requesterId) !== String(tutorId) && String(requesterId) !== String(learnerId)) {
    throw new ApiError(403, 'Only a session participant may record the session');
  }

  // If a rating is provided, only allow the learner (not the tutor) to submit it
  if (rating && String(requesterId) !== String(learnerId)) {
    throw new ApiError(403, 'Only the learner may submit a rating for the session');
  }

  // If meetId provided, ensure both tutor and learner were participants of that meet
  if (meetId) {
    if (!mongoose.Types.ObjectId.isValid(meetId)) throw new ApiError(400, 'Invalid meetId');
    const meet = await Meet.findById(meetId).lean();
    if (!meet) throw new ApiError(404, 'Meet not found');

    // Resolve emails for tutor/learner
    const [tutorUser, learnerUser] = await Promise.all([
      User.findById(tutorId).select('email'),
      User.findById(learnerId).select('email'),
    ]);
    if (!tutorUser || !learnerUser) throw new ApiError(404, 'Tutor or learner not found');

    const participantsMatch = (String(meet.organizer) === String(tutorId) || (meet.attendees || []).includes(tutorUser.email))
      && (String(meet.organizer) === String(learnerId) || (meet.attendees || []).includes(learnerUser.email));

    if (!participantsMatch) {
      throw new ApiError(403, 'Both tutor and learner must be participants of the referenced meeting');
    }
  }

  // If matchId provided, ensure tutor and learner belong to that match (user1/user2)
  if (matchId) {
    if (!mongoose.Types.ObjectId.isValid(matchId)) throw new ApiError(400, 'Invalid matchId');
    const match = await Match.findById(matchId).lean();
    if (!match) throw new ApiError(404, 'Match not found');
    const ok = (String(match.user1) === String(tutorId) && String(match.user2) === String(learnerId))
      || (String(match.user1) === String(learnerId) && String(match.user2) === String(tutorId));
    if (!ok) throw new ApiError(403, 'Tutor and learner must be the two users in the specified match');
  }

  // If neither meetId nor matchId provided, require that the two users have an accepted match
  if (!meetId && !matchId) {
    const existing = await Match.findOne({
      $or: [
        { user1: tutorId, user2: learnerId },
        { user1: learnerId, user2: tutorId },
      ],
      status: 'accepted',
    }).lean();
    if (!existing) throw new ApiError(403, 'No accepted match exists between tutor and learner');
  }

  // If a meetId is provided, try to update an existing session for that meet instead of creating duplicate
  if (meetId) {
    const existing = await Session.findOne({ meet: meetId, tutor: tutorId, learner: learnerId });
    if (existing) {
      existing.date = new Date(date);
      existing.durationInMinutes = durationInMinutes;
      existing.completed = true;
      if (rating) existing.rating = rating;
      if (review) existing.review = review;
      await existing.save();

      // If a rating was provided, create a Review tied to this session.
      if (rating && rating > 0) {
        try {
          const fromUser = requesterId;
          const toUser = String(fromUser) === String(tutorId) ? learnerId : tutorId;
          await Review.create({ session: existing._id, fromUser, toUser, rating, text: review || undefined });
        } catch (err) {
          console.error('Failed to create linked review for session:', err);
        }
      }

      return res.status(200).json(new ApiResponse(200, existing, 'Session updated'));
    }
  }

  // Otherwise create a new session record (marking it completed)
  const session = await Session.create({
    match: matchId || undefined,
    meet: meetId || undefined,
    tutor: tutorId,
    learner: learnerId,
    date: new Date(date),
    durationInMinutes,
    completed: true,
    rating: rating || undefined,
    review: review || undefined,
  });

  // If a rating was provided, create a Review tied to this session.
  if (rating && rating > 0) {
    try {
      const fromUser = requesterId;
      const toUser = String(fromUser) === String(tutorId) ? learnerId : tutorId;
      await Review.create({ session: session._id, fromUser, toUser, rating, text: review || undefined });
    } catch (err) {
      console.error('Failed to create linked review for session:', err);
    }
  }

  return res.status(201).json(new ApiResponse(201, session, 'Session recorded'));
});

// Get sessions for current user (as tutor or learner)
export const getMySessions = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const sessions = await Session.find({ $or: [{ tutor: userId }, { learner: userId }] })
    .populate('tutor', 'name email')
    .populate('learner', 'name email')
    .sort({ date: -1 })
    .lean();

  return res.status(200).json(new ApiResponse(200, sessions, 'Sessions fetched'));
});

// Summary for current user: hours taught/learned, avg rating received, current streak
export const getMySummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Hours taught and learned
  const taughtAgg = await Session.aggregate([
    { $match: { tutor: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, totalMinutes: { $sum: "$durationInMinutes" }, count: { $sum: 1 }, avgRating: { $avg: "$rating" } } }
  ]);

  const learnedAgg = await Session.aggregate([
    { $match: { learner: new mongoose.Types.ObjectId(userId) } },
    { $group: { _id: null, totalMinutes: { $sum: "$durationInMinutes" }, count: { $sum: 1 } } }
  ]);

  const taughtMinutes = (taughtAgg[0] && taughtAgg[0].totalMinutes) || 0;
  const taughtCount = (taughtAgg[0] && taughtAgg[0].count) || 0;
  const avgRatingReceived = (taughtAgg[0] && taughtAgg[0].avgRating) ? Number((taughtAgg[0].avgRating).toFixed(2)) : null;

  const learnedMinutes = (learnedAgg[0] && learnedAgg[0].totalMinutes) || 0;
  const learnedCount = (learnedAgg[0] && learnedAgg[0].count) || 0;

  // Current streak: count consecutive days ending today with at least one completed session (as tutor or learner)
  const sessions = await Session.find({ $or: [{ tutor: userId }, { learner: userId }] }).select('date').sort({ date: -1 }).lean();
  let streak = 0;
  if (sessions && sessions.length > 0) {
    const msInDay = 24 * 60 * 60 * 1000;
    const today = new Date();
    let currentDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let i = 0;
    while (i < sessions.length) {
      const sDate = new Date(sessions[i].date);
      const sDay = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate());
      const diff = Math.round((currentDay - sDay) / msInDay);
      if (diff === 0) {
        streak += 1;
        // move to previous day
        currentDay = new Date(currentDay.getTime() - msInDay);
        // skip any other sessions on same day
        while (i < sessions.length && new Date(sessions[i].date).setHours(0,0,0,0) === sDay.setHours(0,0,0,0)) i++;
      } else if (diff > 0) {
        // no session for currentDay
        break;
      } else {
        i++;
      }
    }
  }

  return res.status(200).json(new ApiResponse(200, {
    hoursTaught: Math.round((taughtMinutes/60) * 100)/100,
    sessionsTaught: taughtCount,
    avgRatingReceived,
    hoursLearned: Math.round((learnedMinutes/60) * 100)/100,
    sessionsLearned: learnedCount,
    currentStreakDays: streak,
  }, 'Session summary'));
});
