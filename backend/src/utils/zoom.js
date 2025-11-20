
import jwt from 'jsonwebtoken';

const ZOOM_API_BASE = 'https://api.zoom.us/v2';

// Simple in-memory cache for server-to-server token
let cachedToken = null;
let cachedTokenExpiry = 0;

export async function getServerOAuthToken() {
  // Prefer Server-to-Server OAuth if configured
  const CLIENT_ID = process.env.ZOOM_CLIENT_ID;
  const CLIENT_SECRET = process.env.ZOOM_CLIENT_SECRET;
  const ACCOUNT_ID = process.env.ZOOM_ACCOUNT_ID;

  if (CLIENT_ID && CLIENT_SECRET && ACCOUNT_ID) {
    const now = Date.now();
    if (cachedToken && cachedTokenExpiry - 5000 > now) return cachedToken;

    const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    const url = `https://zoom.us/oauth/token`;
    const body = new URLSearchParams();
    body.append('grant_type', 'account_credentials');
    body.append('account_id', ACCOUNT_ID);
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
      },
      body: body.toString(),
    });
    if (!res.ok) {
      let txt;
      try { txt = await res.text(); } catch (e) { txt = String(e); }
      // Provide a clearer error for invalid_client
      if (res.status === 400 && txt && txt.includes('invalid_client')) {
        throw new Error(
          `Zoom token error: invalid_client. Verify ZOOM_CLIENT_ID and ZOOM_CLIENT_SECRET are correct and belong to a Server-to-Server OAuth app. Response: ${txt}`
        );
      }
      throw new Error(`Zoom token error: ${res.status} ${txt}`);
    }
    const data = await res.json();
    cachedToken = data.access_token;
    cachedTokenExpiry = Date.now() + (data.expires_in || 3600) * 1000;
    return cachedToken;
  }

  // Fallback to JWT (legacy) if provided
  if (process.env.ZOOM_API_KEY && process.env.ZOOM_API_SECRET) {
    const payload = { iss: process.env.ZOOM_API_KEY, exp: Math.floor(Date.now() / 1000) + 60 };
    return jwt.sign(payload, process.env.ZOOM_API_SECRET);
  }

  throw new Error('No Zoom credentials configured (server-to-server or JWT)');
}

export async function getServerOAuthTokenInfo() {
  const token = await getServerOAuthToken();
  let decoded = null;
  try {
    decoded = jwt.decode(token);
  } catch (e) {
    // ignore decode errors
  }
  return { token, decoded, expiresAt: cachedTokenExpiry };
}

export async function createZoomMeeting(meet) {
  const token = await getServerOAuthToken();
  const userId = process.env.ZOOM_USER_ID; // user under which to create meeting (email or id)
  if (!userId) throw new Error('ZOOM_USER_ID not configured');

  const startTime = new Date(meet.dateAndTime).toISOString();
  const body = {
    topic: meet.title || 'Skill Swap Meeting',
    type: 2,
    start_time: startTime,
    duration: meet.durationInMinutes || 60,
    timezone: process.env.TIMEZONE || 'UTC',
    settings: { join_before_host: true, mute_upon_entry: true },
  };

  const res = await fetch(`${ZOOM_API_BASE}/users/${encodeURIComponent(userId)}/meetings`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    const err = new Error(`Zoom API error: ${res.status} ${text}`);
    err.status = res.status;
    throw err;
  }

  return await res.json();
}

export async function deleteZoomMeeting(meetingId) {
  if (!meetingId) return;
  const token = await getServerOAuthToken();
  const res = await fetch(`${ZOOM_API_BASE}/meetings/${meetingId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok && res.status !== 404) {
    const text = await res.text();
    throw new Error(`Failed to delete Zoom meeting: ${res.status} ${text}`);
  }
}
