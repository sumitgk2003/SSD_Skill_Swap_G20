import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    interests: {
      type: Array,
      default: [],
      items: {
        type: String,
      },
    },
    skills: {
      type: Array,
      default: [],
      items: {
        type: String,
      },
    },
    bio: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    // Google/OAuth fields
    googleId: {
      type: String,
      index: true,
      sparse: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    googleAccessToken: {
      type: String,
      default: null,
    },
    googleRefreshToken: {
      type: String,
      default: null,
    },
    googleTokenExpiry: {
      type: Date,
      default: null,
    },
    // Timezone and availability for scheduling
    timezone: {
      type: String,
      default: null,
    },
    // Preferred session formats: 'online', 'in person', 'chat'
    preferredFormats: {
      type: [String],
      default: ['online','in person','chat'],
    },
    // Availability slots: { dayOfWeek: 0-6 (Sun-Sat), start: 'HH:MM', end: 'HH:MM' }
    availability: {
      type: [
        {
          dayOfWeek: { type: Number, min: 0, max: 6 },
          start: { type: String },
          end: { type: String },
        }
      ],
      default: []
    },
    // Note: admin users are stored in a separate Admin model; do not add role here.
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
