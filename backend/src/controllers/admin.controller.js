import { Admin } from "../models/admin.model.js";
import { User } from "../models/user.model.js";


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
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
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
    return res.status(200).clearCookie('accessToken', options).clearCookie('refreshToken', options).json({ success: true, message: 'Admin logged out' });
  } catch (err) {
    return res.status(500).json({ success: false, message: String(err) });
  }
}
