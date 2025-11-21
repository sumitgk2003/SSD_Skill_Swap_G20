import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

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

export const requireAdmin = asyncHandler(async (req, res, next) => {
  // verifyJWT should have already set req.user; check Admin collection by email
  if (!req.user || !req.user.email) throw new ApiError(401, 'Unauthorized');
  // Lazy-load Admin model here to avoid circular imports at top
  const { Admin } = await import("../models/admin.model.js");
  const admin = await Admin.findOne({ email: req.user.email.toLowerCase() });
  if (!admin) throw new ApiError(403, 'Admin privileges required');
  next();
});
