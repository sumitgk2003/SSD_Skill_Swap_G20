import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";
import { Match } from "../models/match.model.js";
import SitePolicy from '../models/policy.model.js';
import { Meet } from '../models/meet.model.js';
import { deleteGoogleCalendarEvent } from '../utils/googleCalendar.js';
import { deleteZoomMeeting } from '../utils/zoom.js';


 export async function createAdmin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: "Email and password required" });
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(400).json({ success: false, message: "Admin already exists" });
    const admin = new Admin({ email, password });
    await admin.save();
    return res.json({ success: true, data: { id: admin._id, email: admin.email } });
  } catch (err) {
    return res.status(500).json({ success: false, message: String(err) });
  }
}

 export async function populateAdminSkills(req, res) {
  try {
    const { adminEmail } = req.body; // optional - if not provided, pick first admin
    const admin = adminEmail
      ? await Admin.findOne({ email: adminEmail.toLowerCase() })
      : await Admin.findOne();
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found. Create an admin first." });
    // Gather all skills arrays from users
    const users = await User.find({}, { skills: 1 }).lean();
    const skillSet = new Set();
    for (const u of users) {
      if (!u.skills) continue;
      if (Array.isArray(u.skills)) {
        for (const s of u.skills) {
          if (s && typeof s === 'string') skillSet.add(s.trim());
        }
      }
    }
    const skills = Array.from(skillSet).sort((a, b) => a.localeCompare(b));
    admin.skills = skills;
    await admin.save();
    return res.json({ success: true, data: { adminId: admin._id, skillsCount: skills.length, skills } });
  } catch (err) {
    return res.status(500).json({ success: false, message: String(err) });
  }
}


export async function getAdmin(req, res) {
  try {
    const { email } = req.query;
    const admin = email ? await Admin.findOne({ email: email.toLowerCase() }) : await Admin.findOne();
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
    return res.json({ success: true, data: { email: admin.email, skills: admin.skills } });
  } catch (err) {
    return res.status(500).json({ success: false, message: String(err) });
  }
} 

// Helper to generate tokens (internal function)
const generateAccessAndRefreshTokens = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    // Save refresh token to DB (optional but recommended for security)
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error("Something went wrong while generating reference token");
  }
};

export async function loginAdmin(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // 2. Find Admin
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin does not exist" });
    }

    // 3. Check Password
    const isPasswordValid = await admin.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid user credentials" });
    }

    // 4. Generate Tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(admin._id);

    // 5. Prepare Response (Exclude sensitive info)
    const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

    const options = {
      httpOnly: true,
      secure: true, // Set to true in production (https)
    };

    // 6. Return Response
    return res
      .status(200)
      .cookie("adminAccessToken", accessToken, options)
      .cookie("adminRefreshToken", refreshToken, options)
      .json({
        success: true,
        message: "Admin logged in successfully",
        data: {
          user: loggedInAdmin,
          accessToken,
          refreshToken,
        },
      });

  } catch (err) {
    console.error("Login Error:", err);
    return res.status(500).json({ success: false, message: String(err.message) });
  }
}

export async function getAllUsers(req, res) {
  try {
    // Return all users but exclude sensitive fields
    const users = await User.find({}).select('-password -refreshToken -googleRefreshToken').lean();
    return res.json({ success: true, data: users });
  } catch (err) {
    return res.status(500).json({ success: false, message: String(err) });
  }
}


// Admin: delete a user by id
export async function deleteUserById(req, res) {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id).lean();
    if (!deleted) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, data: { id: deleted._id, email: deleted.email } });
  } catch (err) {
    return res.status(500).json({ success: false, message: String(err) });
  }
}

// Admin: delete a skill globally (remove from all users' skills arrays)
// Admin: get skills with match counts (accepted matches)
export async function getAdminSkills(req, res) {
  try {
    // 1. Get all unique skills from users (as earlier)
    const allSkillsAgg = await User.aggregate([
      { $project: { skills: 1, interests: 1 } },
      { $group: { _id: null, uniqueSkills: { $addToSet: '$skills' }, uniqueInterests: { $addToSet: '$interests' } } },
      { $project: { allUnique: { $concatArrays: ['$uniqueSkills', '$uniqueInterests'] } } }
    ]);
    const flattened = allSkillsAgg && allSkillsAgg.length ? [...new Set(allSkillsAgg[0].allUnique.flat())].filter(Boolean) : [];

    // 2. Aggregate matches counts by skill from Match collection (accepted)
    const { Match } = await import('../models/match.model.js');
    const matchAgg = await Match.aggregate([
      { $match: { status: 'accepted' } },
      { $project: { skills: ['$skill1', '$skill2'] } },
      { $unwind: '$skills' },
      { $group: { _id: '$skills', count: { $sum: 1 } } },
      { $project: { _id: 0, skill: '$_id', matchesCount: '$count' } }
    ]);

    const countsMap = new Map();
    for (const m of matchAgg) countsMap.set(m.skill, m.matchesCount || 0);

    const result = flattened.map((s) => ({ skill: s, matchesCount: countsMap.get(s) || 0 }));
    // sort descending by matches
    result.sort((a, b) => b.matchesCount - a.matchesCount);

    return res.json({ success: true, data: result });
  } catch (err) {
    return res.status(500).json({ success: false, message: String(err) });
  }
}

// Admin logout - clear refresh token and cookies
export async function logoutAdmin(req, res) {
  try {
    const adminId = req.user?._id;
    if (!adminId) return res.status(400).json({ success: false, message: 'Invalid admin' });
    await Admin.findByIdAndUpdate(adminId, { $set: { refreshToken: undefined } }, { new: true });
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res.status(200)
      .clearCookie('adminAccessToken', options)
      .clearCookie('adminRefreshToken', options)
      .json({ success: true, message: 'Admin logged out' });
  } catch (err) {
    return res.status(500).json({ success: false, message: String(err) });
  }
}

// Admin: end (delete) a match by id
export async function endMatchById(req, res) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ success: false, message: 'Match id is required' });
    // 1. Find upcoming meets tied to this match (from now onward)
    const now = new Date();
    const upcomingMeets = await Meet.find({ match: id, dateAndTime: { $gte: now } }).lean();

    // 2. Attempt to remove external resources (Google Calendar events, Zoom meetings) and delete the meet records
    let removedMeetsCount = 0;
    for (const m of upcomingMeets) {
      try {
        if (m.googleEventId && m.organizer) {
          try {
            const organizer = await User.findById(m.organizer);
            if (organizer) await deleteGoogleCalendarEvent(organizer, m.googleEventId);
          } catch (e) {
            console.error('Failed to delete Google event for meet', m._id, e?.message || e);
          }
        }

        if (m.zoomMeetingId) {
          try {
            await deleteZoomMeeting(m.zoomMeetingId);
          } catch (e) {
            console.error('Failed to delete Zoom meeting for meet', m._id, e?.message || e);
          }
        }

        await Meet.findByIdAndDelete(m._id);
        removedMeetsCount += 1;
      } catch (err) {
        console.error('Failed to remove meet', m._id, err?.message || err);
      }
    }

    // 3. Delete the match itself
    const deleted = await Match.findByIdAndDelete(id).lean();
    if (!deleted) return res.status(404).json({ success: false, message: 'Match not found' });

    return res.json({ success: true, data: { id: deleted._id, removedMeets: removedMeetsCount }, message: 'Match ended successfully' });
  } catch (err) {
    console.error('endMatchById error', err);
    return res.status(500).json({ success: false, message: String(err) });
  }
}

// Get site policy (public)
export async function getSitePolicy(req, res) {
  try {
    let p = await SitePolicy.findOne();
    if (!p) {
      // Create a default policy document with sensible default content
      const defaultContent = `
        <h1>SkillSwap - Terms of Service & Privacy Policy</h1>

        <h2>Introduction</h2>
        <p>Welcome to SkillSwap. These Terms of Service and Privacy Policy (the "Agreement") govern your access to and use of the SkillSwap website, applications, APIs, and related services (collectively, the "Service"). By creating an account, accessing, or using the Service you agree to be bound by this Agreement. If you do not agree, do not use the Service.</p>

        <h2>1. Eligibility</h2>
        <p>You must be at least 13 years old to use the Service. If you are under 18, you may use the Service only with the involvement of a parent or guardian. By creating an account you represent and warrant that you meet the eligibility requirements set forth in this section.</p>

        <h2>2. Account Registration</h2>
        <p>To access certain features you must register for an account. You agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately if you suspect unauthorized use of your account.</p>

        <h2>3. User Conduct</h2>
        <p>When using SkillSwap you agree not to:</p>
        <ul>
          <li>Violate any applicable laws or regulations.</li>
          <li>Harass, abuse, or harm others.</li>
          <li>Post content that is illegal, defamatory, obscene, or infringes third-party rights.</li>
          <li>Attempt to disrupt the operation of the Service or access it in an unauthorized manner.</li>
        </ul>

        <h2>4. Matches, Meetings and Content</h2>
        <p>The Service facilitates introductions and meetings between users ("Matches"). Matches and scheduled meetings are between users; SkillSwap is not a party to agreements between users. Users are solely responsible for their interactions, communications, and the content they share. SkillSwap may provide features to schedule meets, create calendar events, or enable remote meetings through third-party services (e.g., Zoom, Google Calendar); you consent to the creation and deletion of such events based on your actions in the Service.</p>

        <h2>5. Payments and Fees</h2>
        <p>Some features may be subject to fees. If we offer paid features, the pricing terms will be presented at the time of purchase. All fees are non-refundable except as required by law or as expressly stated in the applicable pricing terms.</p>

        <h2>6. Intellectual Property</h2>
        <p>SkillSwap and its licensors retain all rights, title and interest in and to the Service, including software, content, trademarks, and logos. You may not use SkillSwap's trademarks without our prior written permission. Users retain ownership of the content they upload, subject to the license granted below.</p>

        <h2>7. User Content License</h2>
        <p>By posting, submitting, or contributing content to the Service ("User Content"), you grant SkillSwap a non-exclusive, worldwide, royalty-free, transferable license to host, store, reproduce, modify, create derivative works, communicate, publish and distribute your User Content for the purpose of operating, promoting, and improving the Service.</p>

        <h2>8. Moderation and Disputes</h2>
        <p>We reserve the right to remove or restrict access to any User Content or accounts that violate these Terms or that we determine harmful. If a dispute arises between users, we may in our sole discretion take actions such as suspending accounts, ending Matches, or removing scheduled meets. Admins of the platform may take moderation actions via the admin interface; such actions may delete Matches and associated upcoming meets.</p>

        <h2>9. Ending Matches and Meets</h2>
        <p>Matches between users may be ended by either party or by an admin. When a Match is ended, associated upcoming meets may be canceled. SkillSwap will attempt to remove or cancel linked third-party events (e.g., Google Calendar, Zoom) where possible; however, we are not responsible for third-party data retention or external notifications beyond our control.</p>

        <h2>10. Privacy and Data</h2>
        <p>We collect information you provide (such as name, email, skills, interests, and profile data) and technical information necessary to operate the Service. We use data to provide the Service, to prevent abuse, to personalize content, and to improve our product. We do not sell personal information to third parties. For more details, review our separate Privacy Policy section below.</p>

        <h2>11. Security</h2>
        <p>We implement reasonable administrative, technical, and physical safeguards intended to protect the confidentiality, integrity, and availability of user data. No service is completely secure; we cannot guarantee absolute protection for your data. You are responsible for safeguarding your account credentials and using secure practices.</p>

        <h2>12. Third-Party Services</h2>
        <p>The Service may integrate with third-party services (for authentication, calendars, meeting providers, analytics, or payments). Your use of third-party services is subject to those providers' terms and privacy policies. We are not responsible for the content, operations, privacy, or security of third-party services.</p>

        <h2>13. Limitation of Liability</h2>
        <p>To the fullest extent permitted by law, SkillSwap and its affiliates, officers, directors, employees, and agents will not be liable for any indirect, incidental, special, consequential, or exemplary damages arising from your use of the Service, including loss of profits, goodwill, use, data, or other intangible losses.</p>

        <h2>14. Indemnification</h2>
        <p>You agree to indemnify, defend and hold harmless SkillSwap and its affiliates from and against any claims, liabilities, losses, damages, costs and expenses (including reasonable attorneys' fees) arising from or related to your use of the Service, your violation of this Agreement, or your infringement of third-party rights.</p>

        <h2>15. Termination and Suspension</h2>
        <p>We may suspend or terminate your access to the Service at any time for violation of these Terms or for other reasons. Upon termination, your right to use the Service ceases and any content subject to deletion may be removed in accordance with our data retention policies.</p>

        <h2>16. Governing Law and Dispute Resolution</h2>
        <p>These Terms are governed by the laws of the jurisdiction where the company operates, without regard to conflict of law principles. Any legal claim arising from this Agreement will be resolved in the courts located in that jurisdiction, unless otherwise agreed in writing.</p>

        <h2>17. Changes to these Terms</h2>
        <p>We may revise these Terms from time to time. If we make material changes, we will notify you by posting notice on the Service or by other means 30 days before changes take effect. Continued use of the Service after changes constitutes your acceptance of the updated Terms.</p>

        <h2>18. Privacy Policy (Details)</h2>
        <h3>18.1 Information We Collect</h3>
        <p>We collect information you provide directly (profile data, skills, interests), information about your usage (logs, device information), and information from third parties you connect (e.g., Google account information when you connect your calendar).</p>

        <h3>18.2 How We Use Information</h3>
        <p>We use information to provide and improve the Service, personalize content, communicate with you, process transactions, detect and prevent fraud, and comply with legal obligations.</p>

        <h3>18.3 Sharing and Disclosure</h3>
        <p>We may share information with service providers who perform services on our behalf, with legal authorities when required, and in connection with business transfers such as mergers. Personal information is not sold to third parties.</p>

        <h3>18.4 Data Retention and Deletion</h3>
        <p>We retain data as necessary to provide the Service and as required by law. You may request deletion of your account and personal data; certain data may remain in backups or logs for a limited time.</p>

        <h3>18.5 Security Measures</h3>
        <p>We use industry-standard security practices including encrypted connections and secure storage. However, no method of transmission or storage is 100% secure.</p>

        <h2>19. User Responsibilities</h2>
        <p>Users must follow all applicable laws, be truthful in profile information, and act respectfully. Users should not attempt to impersonate others or subvert the Service’s matching algorithms.</p>

        <h2>20. Reporting Abuse and Safety</h2>
        <p>If you encounter abusive or illegal behavior, please report it using the reporting tools in the Service. We will review reports and take action as necessary, which may include warnings, suspensions, or removal of accounts and content.</p>

        <h2>21. Children's Privacy</h2>
        <p>The Service is not intended for children under 13. If we learn we have collected personal information from a child under 13 without parental consent, we will take steps to remove that information.</p>

        <h2>22. Notices</h2>
        <p>Notices to users may be provided via email, in-app notifications, or posting on the Service. You agree that notices provided electronically satisfy any legal requirement that such notices be in writing.</p>

        <h2>23. International Users</h2>
        <p>If you are using the Service from outside the primary jurisdiction, you are responsible for compliance with local laws. Data transfers may occur across international borders.</p>

        <h2>24. Contact Information</h2>
        <p>If you have questions about this Agreement or the Service, contact our support team at support@skillswap.example (replace with your actual contact email).</p>

        <h2>25. Entire Agreement</h2>
        <p>This Agreement constitutes the entire agreement between you and SkillSwap regarding the Service and supersedes prior agreements.</p>

        <p><em>Last updated: </em> <span id="policy-last-updated">(admin-updated)</span></p>
      `;

      p = await SitePolicy.create({ content: defaultContent });
    }
    return res.json({ success: true, data: p });
  } catch (err) {
    console.error('getSitePolicy error', err);
    return res.status(500).json({ success: false, message: String(err) });
  }
}

// Update site policy (admin only)
export async function updateSitePolicy(req, res) {
  try {
    const { content } = req.body;
    if (typeof content !== 'string') return res.status(400).json({ success: false, message: 'content string is required' });

    let p = await SitePolicy.findOne();
    if (!p) p = await SitePolicy.create({ content });
    else {
      p.content = content;
      await p.save();
    }

    return res.json({ success: true, data: p, message: 'Policy updated' });
  } catch (err) {
    console.error('updateSitePolicy error', err);
    return res.status(500).json({ success: false, message: String(err) });
  }
}
