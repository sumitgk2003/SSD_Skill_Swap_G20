import { Admin } from "../models/admin.model.js";


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
