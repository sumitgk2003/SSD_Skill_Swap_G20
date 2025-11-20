import { google } from "googleapis";
import { User } from "../models/user.model.js";

const getOauth2Client = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/v1/auth/google/callback`
  );

export async function createGoogleCalendarEvent(user, meet) {
  if (!user?.googleRefreshToken && !user?.googleAccessToken) {
    throw new Error('User has not connected Google Calendar');
  }

  const oauth2Client = getOauth2Client();

  // Provide available tokens; google client will refresh if needed when making requests
  const creds = {};
  if (user.googleAccessToken) creds.access_token = user.googleAccessToken;
  if (user.googleRefreshToken) creds.refresh_token = user.googleRefreshToken;
  if (user.googleTokenExpiry) creds.expiry_date = new Date(user.googleTokenExpiry).getTime();

  oauth2Client.setCredentials(creds);

  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  const start = new Date(meet.dateAndTime);
  const end = new Date(start.getTime() + (meet.durationInMinutes || 60) * 60 * 1000);

  const event = {
    summary: meet.title || 'Skill Swap Meet',
    description: `${meet.title || ''}${meet.zoomJoinUrl ? '\n\nZoom: ' + meet.zoomJoinUrl : ''}`,
    start: { dateTime: start.toISOString() },
    end: { dateTime: end.toISOString() },
    attendees: (meet.attendees || []).map(email => ({ email })),
  };

  try {
    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    // Persist refreshed tokens if Google client refreshed them
    const newCreds = oauth2Client.credentials || {};
    if (newCreds.access_token || newCreds.refresh_token || newCreds.expiry_date) {
      try {
        const update = {};
        if (newCreds.access_token) update.googleAccessToken = newCreds.access_token;
        if (newCreds.refresh_token) update.googleRefreshToken = newCreds.refresh_token;
        if (newCreds.expiry_date) update.googleTokenExpiry = new Date(newCreds.expiry_date);
        if (Object.keys(update).length > 0) {
          await User.findByIdAndUpdate(user._id, update, { new: true });
        }
      } catch (e) {
        console.error('Failed to persist refreshed Google tokens:', e?.message || e);
      }
    }

    return res.data; // contains id, htmlLink, etc.
  } catch (err) {
    // rethrow for callers to handle/log
    throw err;
  }
}

export async function deleteGoogleCalendarEvent(user, googleEventId) {
  if (!googleEventId) return;
  const oauth2Client = getOauth2Client();
  const creds = {};
  if (user.googleAccessToken) creds.access_token = user.googleAccessToken;
  if (user.googleRefreshToken) creds.refresh_token = user.googleRefreshToken;
  if (user.googleTokenExpiry) creds.expiry_date = new Date(user.googleTokenExpiry).getTime();
  oauth2Client.setCredentials(creds);
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  try {
    await calendar.events.delete({ calendarId: 'primary', eventId: googleEventId });
  } catch (err) {
    // ignore notFound, rethrow others
    if (err?.code && err.code !== 404) throw err;
  }
}
