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


const getAllActiveClasses = asyncHandler(async (req, res) => {
  const classes = await Class.find({
    status: "active",
  })
    .select("-accessCode")
    .populate("teacher", "name email")
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(
      new ApiResponse(200, classes, "All active classes fetched successfully")
    );
});

const joinClass = asyncHandler(async (req, res) => {
  const { classId, accessCode } = req.body;

  if (!classId || !accessCode) {
    throw new ApiError(400, "Class ID and Access Code are required");
  }

  // Renamed from 'classs' to 'classInstance' for safety
  const classInstance = await Class.findById(classId);

  if (!classInstance) {
    throw new ApiError(404, "Class does not exist");
  }

  if (classInstance.status === "notActive") {
    throw new ApiError(400, "Class has ended");
  }

  if (classInstance.accessCode !== accessCode) {
    throw new ApiError(401, "AccessCode is not correct");
  }

  const updatedStudent = await Student.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        activeClass: classId,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  if (!updatedStudent) {
    throw new ApiError(500, "Failed to update student's active class status.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { student: updatedStudent },
        "Access granted and active class set successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  updateProfile,
  getAllActiveClasses,
  joinClass,
};
