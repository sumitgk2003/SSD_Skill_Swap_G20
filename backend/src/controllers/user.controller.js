import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Match } from "../models/match.model.js";
import mongoose from "mongoose";
import { Review } from "../models/review.model.js";

export const options = {
  httpOnly: true,
  secure: true,
};

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken -googleRefreshToken");
  if (!user) throw new ApiError(404, "User not found");
  return res.status(200).json(new ApiResponse(200, { user }, "Current user fetched"));
});

export const generateAccessAndRefreshTokens = async (UserId) => {
  try {
    const user = await User.findById(UserId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;
  console.log(email, name, password);
  if (
    [name, email, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  console.log("jdfk");
  const existedUser = await User.findOne({
    $or: [{ email }],
  });
  console.log("jdfk");
  console.log(existedUser);
  if (existedUser) {
    throw new ApiError(409, "User already exist");
  }

  const user = await User.create({
    name,
    email,
    password,
  });
  console.log(user);
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(
      500,
      "Something went wrong while registering the user "
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUser, "User Registered Successfully")
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "email is required");
  }
  console.log(email, password);
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  console.log(user);
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out Successfully"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { interests, skills, bio, timezone, preferredFormats, availability } = req.body;
  console.log("jhdbsfjk");
  if (!Array.isArray(interests)) {
    throw new ApiError(400, "Interests must be an array");
  }
  if (!Array.isArray(skills)) {
    throw new ApiError(400, "Skills must be an array");
  } 
  if (typeof bio !== "string") {
    throw new ApiError(400, "Bio must be a string");
  }

  // Convert skills/interests to lowercase before validation and saving
  const lowerCaseSkills = Array.isArray(skills) ? skills.map(skill => skill.toLowerCase()) : [];
  const lowerCaseInterests = Array.isArray(interests) ? interests.map(interest => interest.toLowerCase()) : [];

  // Validate timezone (optional) and preferredFormats
  const allowedFormats = ['online', 'in person', 'chat'];
  const cleanedPreferredFormats = Array.isArray(preferredFormats)
    ? preferredFormats.filter(f => allowedFormats.includes(f))
    : undefined;

  // Validate availability structure if provided
  let cleanedAvailability = undefined;
  if (Array.isArray(availability)) {
    cleanedAvailability = availability
      .filter(slot => slot && typeof slot.dayOfWeek === 'number' && typeof slot.start === 'string' && typeof slot.end === 'string')
      .map(slot => ({ dayOfWeek: slot.dayOfWeek, start: slot.start, end: slot.end }));
  }
  
  console.log("Updating profile for user:", req.user._id);
  console.log("New interests:", lowerCaseInterests);
  console.log("New skills:", lowerCaseSkills); // Log the lowercased skills
  console.log("New bio:", bio);

  const updatePayload = { interests: lowerCaseInterests, skills: lowerCaseSkills, bio };
  if (timezone && typeof timezone === 'string') updatePayload.timezone = timezone;
  if (cleanedPreferredFormats) updatePayload.preferredFormats = cleanedPreferredFormats;
  if (cleanedAvailability) updatePayload.availability = cleanedAvailability;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    updatePayload,
    { new: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new ApiError(500, "Failed to update profile");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

const findMatches = asyncHandler(async (req, res) => {
  // 1. Get inputs
  const { interest } = req.body;
  const userId = req.user._id;

  // 2. Validation
  if (!interest) {
    throw new ApiError(400, "Interest parameter is required");
  }

  // 3. Fetch the Current User to get their 'skills' and availability
  // (req.user only has _id, so we must fetch the full doc to see what skills and availability they provide)
  const currentUser = await User.findById(userId).select("skills availability timezone");
  
  if (!currentUser) {
    throw new ApiError(404, "User not found");
  }

  // 4. Get existing connections for the current user
  const existingConnections = await Match.find({
    $or: [{ user1: userId }, { user2: userId }],
    status: "accepted",
  });

  const connectedUserIds = existingConnections.reduce((acc, match) => {
    if (match.user1.toString() === userId.toString()) {
      acc.add(match.user2.toString());
    } else {
      acc.add(match.user1.toString());
    }
    return acc;
  }, new Set());

  // 5. Run the Reciprocal Query
  const candidates = await User.find({
    _id: { $ne: userId, $nin: Array.from(connectedUserIds) }, // Exclude the user themselves and already connected users
    skills: interest,                         // Filter 1: They teach what user wants
    interests: { $in: currentUser.skills }    // Filter 2: They want what user teaches
  })
  .select("name interests availability timezone skills") 
  .lean();

  // If the current user has provided availability, filter candidates by overlapping slots
  const userAvailability = Array.isArray(currentUser.availability) ? currentUser.availability : [];

  const timeToMinutes = (t) => {
    if (!t || typeof t !== 'string') return null;
    const parts = t.split(':');
    if (parts.length < 2) return null;
    const hh = Number(parts[0]);
    const mm = Number(parts[1]);
    if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
    return hh * 60 + mm;
  };

  const slotsOverlap = (a, b) => {
    if (!a || !b) return false;
    if (typeof a.dayOfWeek !== 'number' || typeof b.dayOfWeek !== 'number') return false;
    if (a.dayOfWeek !== b.dayOfWeek) return false;
    const aStart = timeToMinutes(a.start);
    const aEnd = timeToMinutes(a.end);
    const bStart = timeToMinutes(b.start);
    const bEnd = timeToMinutes(b.end);
    if ([aStart,aEnd,bStart,bEnd].some(v => v === null)) return false;
    // overlap if latest start < earliest end
    return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
  };

  let availabilityFiltered = candidates;
  if (userAvailability.length > 0) {
    availabilityFiltered = candidates.filter(candidate => {
      const candAvail = Array.isArray(candidate.availability) ? candidate.availability : [];
      if (candAvail.length === 0) return false;
      for (const ua of userAvailability) {
        for (const ca of candAvail) {
          try {
            if (slotsOverlap(ua, ca)) return true;
          } catch (e) {
            // ignore malformed slots
          }
        }
      }
      return false;
    });
  }

  const candidateIds = availabilityFiltered.map(c => c._id);
  
  let ratingsMap = new Map();

  if (candidateIds.length > 0) {
    const ratings = await Review.aggregate([
      { $match: { toUser: { $in: candidateIds } } },
      { $group: { _id: '$toUser', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);
  
    ratings.forEach(r => {
      ratingsMap.set(r._id.toString(), { avg: r.avgRating, count: r.count });
    });
  }

  // 6. Format the results
  const matches = availabilityFiltered.map((candidate) => {
    
    // Identify ALL skills of YOURS they are interested in
    const skillsTheyWant = candidate.interests.filter(candidateInterest => 
      currentUser.skills.includes(candidateInterest)
    );

    const ratingInfo = ratingsMap.get(candidate._id.toString());

    return {
      user_id: candidate._id,
      name: candidate.name,
      skills_they_want: skillsTheyWant,
      avgRating: ratingInfo ? ratingInfo.avg : null,
      reviewCount: ratingInfo ? ratingInfo.count : 0
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, matches, "Matches fetched successfully"));
});

const sendRequest = asyncHandler(async (req, res) => {
  const { recipientId, teachSkill, learnSkill } = req.body; 
  const senderId = req.user._id;

  if (!recipientId) {
    throw new ApiError(400, "Recipient ID is required");
  }
  if (!teachSkill || !learnSkill) {
    throw new ApiError(400, "Both teachSkill (what you offer) and learnSkill (what you want) are required");
  }

  if (senderId.toString() === recipientId) {
    throw new ApiError(400, "You cannot send a request to yourself");
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    throw new ApiError(404, "Recipient user not found");
  }

  const existingMatch = await Match.findOne({
    $or: [
      { user1: senderId, user2: recipientId },
      { user1: recipientId, user2: senderId },
    ],
  });

  if (existingMatch) {
    if (existingMatch.status === "pending") {
      throw new ApiError(400, "Connection request is already pending");
    }
    if (existingMatch.status === "accepted") {
      throw new ApiError(400, "You are already connected");
    }
    throw new ApiError(400, "Connection request was previously processed");
  }

  const newMatch = await Match.create({
    user1: senderId,
    user2: recipientId,
    skill1: teachSkill, // Mapped: The sender teaches this
    skill2: learnSkill, // Mapped: The recipient teaches this (sender learns it)
    status: "pending",
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, newMatch, "Connection request sent successfully")
    );
});

const getPendingRequests = asyncHandler(async (req, res) => {
  const currentUser = req.user._id;

  const requests = await Match.find({
    user2: currentUser,
    status: "pending",
  })
  .populate("user1", "name email bio interests") // Get sender's details
  .sort({ createdAt: -1 }); // Show newest requests first

  const formattedRequests = requests.map((req) => ({
    _id: req._id,             // The Match ID (needed to accept/reject)
    sender: req.user1,        // The User Object of the sender
    learning_opportunity: req.skill1, // What they will teach you
    teaching_requirement: req.skill2, // What they want from you
    status: req.status,
    created_at: req.createdAt
  }));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        formattedRequests, 
        "Pending requests fetched successfully"
      )
    );
});

const getConnectedUsers = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const connections = await Match.find({
    $or: [{ user1: userId }, { user2: userId }],
    status: "accepted",
  })
  .populate("user1", "name email bio") // Populate sender details
  .populate("user2", "name email bio"); // Populate recipient details
  
  const formattedConnections = connections.map((match) => {
    if (!match.user1 || !match.user2) {
      console.warn(`Match ${match._id} has a broken user reference. Skipping.`);
      return null;
    }
    const isSender = match.user1._id.toString() === userId.toString();

    const partner = isSender ? match.user2 : match.user1;
    const skillITeach = isSender ? match.skill1 : match.skill2;
    const skillILearn = isSender ? match.skill2 : match.skill1;

    return {
      _id: match._id,             // Match ID (useful for unmatching later)
      partner: partner,           // The other user's details
      skill_i_teach: skillITeach, // What you are contributing
      skill_i_learn: skillILearn, // What you are gaining
      connected_since: match.updatedAt
    };
  }).filter(Boolean); // Remove nulls from broken references

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        formattedConnections, 
        "Connected users fetched successfully"
      )
    );
});

const respondRequest = asyncHandler(async (req, res) => {
  const { requestId, status } = req.body;
  const currentUser = req.user._id;

  // 1. Validation: Input check
  if (!requestId) {
    throw new ApiError(400, "Request ID is required");
  }
  
  if (!["accepted", "rejected"].includes(status)) {
    throw new ApiError(400, "Status must be either 'accepted' or 'rejected'");
  }

  // 2. Find the match request
  const matchRequest = await Match.findById(requestId);

  if (!matchRequest) {
    throw new ApiError(404, "Connection request not found");
  }

  // 3. Security: Ensure the current user is actually the Recipient (user2)
  // Only user2 can accept/reject because user1 sent it.
  if (matchRequest.user2.toString() !== currentUser.toString()) {
    throw new ApiError(403, "You are not authorized to respond to this request");
  }

  // 4. Check if it's already processed
  if (matchRequest.status !== "pending") {
    throw new ApiError(400, "This request has already been processed");
  }

  // 5. Update the status
  matchRequest.status = status;
  await matchRequest.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200, 
        matchRequest, 
        `Connection request ${status} successfully`
      )
    );
});

// New function to get all unique skills and interests
const getAllSkills = asyncHandler(async (req, res) => {
  const allSkillsAndInterests = await User.aggregate([
    {
      $project: {
        skills: 1, // Project only the skills field
        interests: 1 // Project only the interests field
      }
    },
    {
      $group: {
        _id: null, // Group all documents into a single group
        uniqueSkills: { $addToSet: "$skills" }, // Add each skill to a set to ensure uniqueness
        uniqueInterests: { $addToSet: "$interests" } // Add each interest to a set to ensure uniqueness
      }
    },
    {
      $project: {
        _id: 0, // Exclude the default _id field
        allUnique: { $concatArrays: ["$uniqueSkills", "$uniqueInterests"] } // Concatenate skills and interests
      }
    }
  ]);

  if (!allSkillsAndInterests || allSkillsAndInterests.length === 0) {
    return res.status(200).json(new ApiResponse(200, [], "No skills or interests found"));
  }

  // Flatten the array of arrays into a single array and remove duplicates
  const flattenedUniqueArray = [...new Set(allSkillsAndInterests[0].allUnique.flat())];

  return res
    .status(200)
    .json(new ApiResponse(200, flattenedUniqueArray, "All unique skills and interests fetched successfully"));
});

// New function to get all matches for the current user
const getAllConnections = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all matches where the current user is either user1 or user2
  const matches = await Match.find({
    $or: [{ user1: userId }, { user2: userId }],
  })
  .populate("user1", "name email") // Populate details for user1
  .populate("user2", "name email"); // Populate details for user2

  // Format the matches to be more readable
  const formattedMatches = matches.map((match) => {
    if (!match.user1 || !match.user2) {
      console.warn(`Match ${match._id} has a broken user reference. Skipping.`);
      return null;
    }
    const isCurrentUser1 = match.user1._id.toString() === userId.toString();
    const partner = isCurrentUser1 ? match.user2 : match.user1;
    const currentUserSkill = isCurrentUser1 ? match.skill1 : match.skill2;
    const partnerSkill = isCurrentUser1 ? match.skill2 : match.skill1;

    return {
      _id: match._id,
      partner: {
        _id: partner._id,
        name: partner.name,
        email: partner.email,
      },
      status: match.status,
      skill_i_teach: currentUserSkill, // Skill the current user is teaching in this match
      skill_i_learn: partnerSkill,     // Skill the current user is learning in this match
      created_at: match.createdAt,
      updated_at: match.updatedAt,
    };
  }).filter(Boolean); // remove nulls

  return res
    .status(200)
    .json(new ApiResponse(200, formattedMatches, "All matches fetched successfully"));
});

const getUserProfileById = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const userProfile = await User.findById(userId).select(
    "name email bio skills interests avatar createdAt"
  );

  if (!userProfile) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userProfile, "User profile fetched successfully"));
});


export {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  findMatches,
  sendRequest,
  getPendingRequests,
  getConnectedUsers,
  respondRequest,
  getAllSkills, // Export the new function
  getAllConnections, // Export the new function
  getUserProfileById
};
export { getCurrentUser };