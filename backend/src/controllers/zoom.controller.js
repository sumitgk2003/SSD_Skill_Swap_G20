import { Router } from 'express';
import { getServerOAuthTokenInfo, createZoomMeeting, deleteZoomMeeting } from '../utils/zoom.js';

// Controller functions for zoom diagnostics
export async function tokenTest(req, res) {
  try {
    const info = await getServerOAuthTokenInfo();

    // If user requested a test create (query ?create=1) we will attempt to create and then delete a tiny meeting.
    if (req.query.create === '1') {
      try {
        const meetPayload = {
          title: 'Diagnostic Meeting (auto-delete)',
          dateAndTime: new Date().toISOString(),
          durationInMinutes: 1,
        };
        const created = await createZoomMeeting(meetPayload);
        // Immediately delete the meeting to avoid polluting account
        try { await deleteZoomMeeting(created.id || created.id_str || created.meetingId || created.uuid); } catch (e) { /* ignore deletion errors */ }
        return res.json({ tokenInfo: info, createResult: created });
      } catch (createErr) {
        return res.status(400).json({ tokenInfo: info, createError: String(createErr), raw: (createErr && createErr.message) || null });
      }
    }

    return res.json({ tokenInfo: info });
  } catch (err) {
    return res.status(500).json({ error: String(err) });
  }
}

const router = Router();
router.get('/token-test', tokenTest);

export default router;
