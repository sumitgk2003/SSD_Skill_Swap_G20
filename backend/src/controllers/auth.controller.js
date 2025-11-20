import { google } from "googleapis";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { generateAccessAndRefreshTokens, options } from "./user.controller.js";

const getOauth2Client = () =>
  new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.BACKEND_URL}/api/v1/auth/google/callback`
  );

export const getGoogleLoginUrl = asyncHandler(async (req, res) => {
  // Sanity check: ensure GOOGLE_CLIENT_ID is loaded
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error("Missing GOOGLE_CLIENT_ID in environment variables");
    return res.status(500).json(new ApiResponse(500, null, "Server misconfiguration: GOOGLE_CLIENT_ID missing"));
  }

  console.log("Generating Google auth URL using client id:", process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.slice(0, 10) + "..." : "(none)");

  const oauth2Client = getOauth2Client();

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["openid", "email", "profile", "https://www.googleapis.com/auth/calendar"],
    prompt: "consent",
  });

  return res.status(200).json(new ApiResponse(200, { authUrl }, "Google login URL generated"));
});

export const handleGoogleCallbackPublic = asyncHandler(async (req, res) => {
  const { code } = req.query;
  if (!code) throw new ApiError(400, "Authorization code not provided");

  // Initialize an OAuth2 client for this request (oauth2Client must be defined here)
  const oauth2Client = getOauth2Client();

  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Verify id token and get profile
  let payload;
  try {
    const ticket = await oauth2Client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch (err) {
    throw new ApiError(401, "Invalid ID token");
  }

  if (!payload?.email || !payload.email_verified) {
    throw new ApiError(400, "Google account must have a verified email");
  }

  const googleId = payload.sub;
  const email = payload.email.toLowerCase();
  const name = payload.name || "";
  const avatar = payload.picture || "";

  // Find existing user by googleId or email
  let user = await User.findOne({ googleId });
  if (!user) {
    user = await User.findOne({ email });
    if (user) {
      // Attach googleId to existing account (auto-link). Depending on your policy, you may require verification.
      user.googleId = googleId;
    }
  }

  if (!user) {
    // create new user; give a random password placeholder
    user = new User({
      email,
      name,
      avatar,
      googleId,
      password: Math.random().toString(36).slice(2, 12),
    });
  }

  // Save tokens
  if (tokens.access_token) user.googleAccessToken = tokens.access_token;
  if (tokens.refresh_token) user.googleRefreshToken = tokens.refresh_token;
  if (tokens.expiry_date) user.googleTokenExpiry = new Date(tokens.expiry_date);

  await user.save();

  // Create app tokens and set cookies
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  // Redirect to frontend success path so frontend can fetch /me and finish login
  const frontendSuccessUrl = (process.env.FRONTEND_URL || "http://localhost:5173") + "/auth/success";

  return res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .redirect(frontendSuccessUrl);
});

export const disconnectGoogleCalendar = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  user.googleAccessToken = null;
  user.googleRefreshToken = null;
  user.googleTokenExpiry = null;
  await user.save();

  return res.status(200).json(new ApiResponse(200, {}, "Google disconnected"));
});
