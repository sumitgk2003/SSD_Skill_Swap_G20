import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";

// Create an admin user (email + password). If admin already exists, return existing.
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

// Populate admin.skills with all unique skills present across User.skills
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
