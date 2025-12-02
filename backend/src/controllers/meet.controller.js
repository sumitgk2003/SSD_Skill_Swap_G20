import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Meet } from "../models/meet.model.js";
import { Session } from "../models/session.model.js";
import { User } from "../models/user.model.js";
import { createGoogleCalendarEvent, deleteGoogleCalendarEvent } from "../utils/googleCalendar.js";
import { createZoomMeeting, deleteZoomMeeting } from "../utils/zoom.js";

export const createMeet = asyncHandler(async (req, res) => {
  const { match_id, type, date, time, duration, note, with: withUser, role } = req.body;
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

  // Optionally pre-create a Session if the scheduler specified a role and provided the other user's id
  let createdSession = null;
  try {
    if (role && withUser && withUser.id) {
      const other = await User.findById(withUser.id).select('_id');
      if (other) {
        const organizerId = req.user._id;
        const tutorId = role === 'teach' ? organizerId : other._id;
        const learnerId = role === 'teach' ? other._id : organizerId;
        createdSession = await Session.create({
          match: match_id || undefined,
          meet: meet._id,
          tutor: tutorId,
          learner: learnerId,
          date: dateTime,
          durationInMinutes: duration,
          completed: false,
        });
      }
    }
  } catch (err) {
    console.error('Failed to pre-create session for meeting:', err);
  }

  // Populate match and organizer for the response to include skill info
  const meetWithDetails = await Meet.findById(meet._id).populate('match').populate('organizer', 'name email _id');
  
  // Determine which skill is being taught based on role and match details
  if (meetWithDetails.match && role) {
    if (role === 'teach') {
      const organizerIsUser1 = meetWithDetails.match.user1.toString() === req.user._id.toString();
      meetWithDetails.skillBeingTaught = organizerIsUser1 ? meetWithDetails.match.skill1 : meetWithDetails.match.skill2;
    } else if (role === 'learn') {
      const organizerIsUser1 = meetWithDetails.match.user1.toString() === req.user._id.toString();
      meetWithDetails.skillBeingTaught = organizerIsUser1 ? meetWithDetails.match.skill2 : meetWithDetails.match.skill1;
    }
  }

  return res.status(201).json(new ApiResponse(201, { meet: meetWithDetails, session: createdSession }, 'Meet created'));
});

export const getMyMeets = asyncHandler(async (req, res) => {
  // Return meets where the user is organizer or is an attendee (by email)
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  const meets = await Meet.find({
    $or: [ { organizer: req.user._id }, { attendees: user.email } ]
  }).sort({ dateAndTime: 1 }).populate('organizer', 'name email _id').populate('match');

  // attach organizerName and determine skillBeingTaught for frontend convenience
  meets.forEach(m => {
    if (m.organizer && m.organizer.name) m.organizerName = m.organizer.name;
    
    // Determine which skill is being taught based on who is organizing
    if (m.match) {
      const organizerIsUser1 = m.match.user1.toString() === m.organizer._id.toString();
      
      // If organizer is user1, they teach skill1; if organizer is user2, they teach skill2
      if (organizerIsUser1) {
        m.skillBeingTaught = m.match.skill1;
      } else {
        m.skillBeingTaught = m.match.skill2;
      }
    }
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
  // allow organizer or an attendee (by email) to cancel
  const requestingUser = await User.findById(req.user._id).select('email');
  const isOrganizer = meet.organizer && meet.organizer.equals && meet.organizer.equals(req.user._id);
  const isAttendee = Array.isArray(meet.attendees) && requestingUser && meet.attendees.includes(requestingUser.email);
  if (!isOrganizer && !isAttendee) throw new ApiError(403, 'Not allowed');

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

export const rescheduleMeet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { date, time, duration } = req.body;

  if (!date || !time || !duration) throw new ApiError(400, 'date, time and duration are required');

  const meet = await Meet.findById(id);
  if (!meet) throw new ApiError(404, 'Meet not found');
  // allow organizer or an attendee to reschedule
  const requestingUser = await User.findById(req.user._id).select('email');
  const isOrganizer = meet.organizer && meet.organizer.equals && meet.organizer.equals(req.user._id);
  const isAttendee = Array.isArray(meet.attendees) && requestingUser && meet.attendees.includes(requestingUser.email);
  if (!isOrganizer && !isAttendee) throw new ApiError(403, 'Not allowed');

  const dateTime = new Date(`${date}T${time}:00`);
  if (isNaN(dateTime.getTime())) throw new ApiError(400, 'Invalid date/time');

  // Update meet fields
  meet.dateAndTime = dateTime;
  meet.durationInMinutes = duration;
  await meet.save();

  // If there is a pre-created session for this meet that is not completed, update it
  try {
    const session = await Session.findOne({ meet: meet._id, completed: false });
    if (session) {
      session.date = dateTime;
      session.durationInMinutes = duration;
      await session.save();
    }
  } catch (err) {
    console.error('Failed to update linked session during reschedule:', err);
  }

  // Attempt to update calendar/zoom by deleting old and recreating if possible
  try {
    const user = await User.findById(req.user._id);
    if (meet.googleEventId && (user.googleRefreshToken || user.googleAccessToken)) {
      try {
        await deleteGoogleCalendarEvent(user, meet.googleEventId);
      } catch (e) {
        console.error('Failed to delete old Google event during reschedule:', e);
      }
      try {
        const event = await createGoogleCalendarEvent(user, meet);
        if (event && event.id) {
          meet.googleEventId = event.id;
          meet.googleEventHtmlLink = event.htmlLink || meet.googleEventHtmlLink;
          await meet.save();
        }
      } catch (e) {
        console.error('Failed to create new Google event during reschedule:', e);
      }
    }

    if (meet.zoomMeetingId) {
      try {
        await deleteZoomMeeting(meet.zoomMeetingId);
      } catch (e) {
        console.error('Failed to delete old Zoom meeting during reschedule:', e);
      }
      try {
        const z = await createZoomMeeting(meet);
        if (z && z.id) {
          meet.zoomMeetingId = z.id;
          meet.zoomJoinUrl = z.join_url || meet.zoomJoinUrl;
          await meet.save();
        }
      } catch (e) {
        console.error('Failed to create new Zoom meeting during reschedule:', e);
      }
    }
  } catch (err) {
    console.error('Calendar/Zoom reschedule helpers failed:', err);
  }

  return res.status(200).json(new ApiResponse(200, meet, 'Meet rescheduled'));
});
