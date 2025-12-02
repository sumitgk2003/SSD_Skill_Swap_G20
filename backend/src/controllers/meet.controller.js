import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Meet } from "../models/meet.model.js";
import { Match } from "../models/match.model.js";
import { Notification } from "../models/notification.model.js";
import { User } from "../models/user.model.js";
import { createGoogleCalendarEvent, deleteGoogleCalendarEvent } from "../utils/googleCalendar.js";
import { createZoomMeeting, deleteZoomMeeting } from "../utils/zoom.js";

export const createMeet = asyncHandler(async (req, res) => {
  const { match_id, type, date, time, duration, note, with: withUser } = req.body;
  if (!date || !time || !duration) throw new ApiError(400, "Missing required fields");

  const dateTime = new Date(`${date}T${time}:00`);
  if (isNaN(dateTime.getTime())) throw new ApiError(400, "Invalid date/time");

  const meet = new Meet({
    meetType: type || 'online',
    dateAndTime: dateTime,
    title: note || (withUser ? `Meeting with ${withUser.name}` : 'Skill Swap Meeting'),
    match: match_id,
    durationInMinutes: duration,
    organizer: req.user._id,
    attendees: withUser && withUser.email ? [withUser.email] : [],
  });

  await meet.save();

  // If meeting is online, try to create a Zoom meeting (uses server-level Zoom credentials)
  if (meet.meetType === 'online') {
    try {
      const z = await createZoomMeeting(meet);
      if (z && z.id) {
        meet.zoomMeetingId = z.id;
        if (z.join_url) meet.zoomJoinUrl = z.join_url;
        await meet.save();
      }
    } catch (err) {
      console.error('Failed to create Zoom meeting:', err?.message || err);
    }
  }

  // Try to create a Google Calendar event if the organizer has connected Google
  const user = await User.findById(req.user._id);
  if (user && (user.googleRefreshToken || user.googleAccessToken)) {
    try {
      const event = await createGoogleCalendarEvent(user, meet);
      if (event && event.id) {
        meet.googleEventId = event.id;
        if (event.htmlLink) meet.googleEventHtmlLink = event.htmlLink;
        await meet.save();
      }
    } catch (err) {
      // Log the error server-side and continue — do not block meet creation
      console.error('Failed to create Google Calendar event:', err?.message || err);
    }
  }

  // Notify other participant(s) in the match (if match provided)
  if (meet.match) {
    try {
      const match = await Match.findById(meet.match).select('user1 user2');
      if (match) {
        const recipients = [];
        if (String(match.user1) !== String(req.user._id)) recipients.push(match.user1);
        if (String(match.user2) !== String(req.user._id)) recipients.push(match.user2);

        const title = `New meeting scheduled`;
        const body = `Meeting "${meet.title}" is scheduled for ${meet.dateAndTime.toISOString()}`;

        for (const r of recipients) {
          await Notification.create({
            user: r,
            actor: req.user._id,
            type: 'meet.created',
            title,
            body,
            data: { meetId: meet._id, matchId: meet.match }
          });
        }
      }
    } catch (err) {
      console.error('Failed to create notifications for new meet:', err);
    }
  }

  return res.status(201).json(new ApiResponse(201, meet, 'Meet created'));
});

// Reschedule a meet
export const rescheduleMeet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date, time, duration } = req.body;

  if (!id) throw new ApiError(400, 'Meet id is required');
  const meet = await Meet.findById(id);
  if (!meet) throw new ApiError(404, 'Meet not found');
  if (!meet.organizer.equals(req.user._id)) throw new ApiError(403, 'Not allowed');

  if (date && time) {
    const dt = new Date(`${date}T${time}:00`);
    if (isNaN(dt.getTime())) throw new ApiError(400, 'Invalid date/time');
    meet.dateAndTime = dt;
  }
  if (duration) meet.durationInMinutes = duration;

  await meet.save();

  // Attempt to notify the other user(s) in the match (if present)
  if (meet.match) {
    try {
      const match = await Match.findById(meet.match).select('user1 user2');
      if (match) {
        const recipients = [];
        if (String(match.user1) !== String(req.user._id)) recipients.push(match.user1);
        if (String(match.user2) !== String(req.user._id)) recipients.push(match.user2);

        const title = `Meeting rescheduled`;
        const body = `Meeting "${meet.title}" was rescheduled to ${meet.dateAndTime.toISOString()}`;

        for (const r of recipients) {
          await Notification.create({
            user: r,
            actor: req.user._id,
            type: 'meet.rescheduled',
            title,
            body,
            data: { meetId: meet._id }
          });
        }
      }
    } catch (err) {
      console.error('Failed to create notifications for reschedule:', err);
    }
  }

  return res.status(200).json(new ApiResponse(200, meet, 'Meet rescheduled'));
});

export const getMyMeets = asyncHandler(async (req, res) => {
  // Return meets where the user is organizer or is an attendee (by email)
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  const meets = await Meet.find({
    $or: [ { organizer: req.user._id }, { attendees: user.email } ]
  }).sort({ dateAndTime: 1 }).populate('organizer', 'name email').lean();

  // attach organizerName for frontend convenience
  meets.forEach(m => {
    if (m.organizer && m.organizer.name) m.organizerName = m.organizer.name;
  });

  return res.status(200).json(new ApiResponse(200, meets, 'User meets'));
});

// New function to get meets by match ID
export const getMeetsByMatchId = asyncHandler(async (req, res) => {
  const { matchId } = req.body; // Expecting matchId in the request body
  const userId = req.user._id;

  if (!matchId) {
    throw new ApiError(400, "Match ID is required in the request body.");
  }

  // Find meets where the user is the organizer OR the user's email is in the attendees list, AND the matchId matches
  const meets = await Meet.find({
    match: matchId,
    $or: [
      { organizer: userId },
      { attendees: { $in: [req.user.email] } } // Assuming req.user.email is available after authentication
    ]
  }).sort({ dateAndTime: 1 }).populate('organizer', 'name email').lean();

  // Attach organizerName for frontend convenience
  meets.forEach(m => {
    if (m.organizer && m.organizer.name) {
      m.organizerName = m.organizer.name;
    }
  });

  return res.status(200).json(new ApiResponse(200, meets, `Meets for match ID ${matchId}`));
});


export const deleteMeet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const meet = await Meet.findById(id);
  if (!meet) throw new ApiError(404, 'Meet not found');
  if (!meet.organizer.equals(req.user._id)) throw new ApiError(403, 'Not allowed');

  // attempt to delete calendar event
  if (meet.googleEventId) {
    const user = await User.findById(req.user._id);
    try {
      await deleteGoogleCalendarEvent(user, meet.googleEventId);
    } catch (err) {
      console.error('Failed to delete Google Calendar event:', err?.message || err);
    }
  }

  // attempt to delete zoom meeting if present
  if (meet.zoomMeetingId) {
    try {
      await deleteZoomMeeting(meet.zoomMeetingId);
    } catch (err) {
      console.error('Failed to delete Zoom meeting:', err?.message || err);
    }
  }

  await meet.deleteOne();
  return res.status(200).json(new ApiResponse(200, {}, 'Meet deleted'));
});
