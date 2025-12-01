import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


// For normal user authentication
export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    throw new ApiError(401, error);
  }
});

// For admin authentication (uses adminAccessToken cookie)
export const verifyAdminJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.adminAccessToken;
    if (!token) {
      throw new ApiError(401, "Unauthorized admin request");
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    throw new ApiError(401, error);
  }
});

// Use verifyAdminJWT before this in admin routes
export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || !req.user.email) throw new ApiError(401, 'Unauthorized');
  // Lazy-load Admin model here to avoid circular imports at top
  const { Admin } = await import("../models/admin.model.js");
  const admin = await Admin.findOne({ email: req.user.email.toLowerCase() });
  if (!admin) throw new ApiError(403, 'Admin privileges required');
  next();
});
