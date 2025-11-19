import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const options = {
  httpOnly: true,
  secure: true,
};

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
  const { interests, skills, bio } = req.body;
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

  console.log("Updating profile for user:", req.user._id);
  console.log("New interests:", interests);
  console.log("New skills:", skills);
  console.log("New bio:", bio);

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { interests, skills, bio },
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

  // 3. Fetch the Current User to get their 'skills'
  // (req.user only has _id, so we must fetch the full doc to see what skills they can offer)
  const currentUser = await User.findById(userId).select("skills");
  
  if (!currentUser) {
    throw new ApiError(404, "User not found");
  }

  // 4. Run the Reciprocal Query
  const candidates = await User.find({
    _id: { $ne: userId },                     // Exclude the user themselves
    skills: interest,                         // Filter 1: They teach what user wants
    interests: { $in: currentUser.skills }    // Filter 2: They want what user teaches
  })
  .select("name interests") 
  .lean();

  // 5. Format the results
  const matches = candidates.map((candidate) => {
    
    // Identify ALL skills of YOURS they are interested in
    const skillsTheyWant = candidate.interests.filter(candidateInterest => 
      currentUser.skills.includes(candidateInterest)
    );

    return {
      user_id: candidate._id,
      name: candidate.name,
      skills_they_want: skillsTheyWant 
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, matches, "Matches fetched successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  findMatches
};
