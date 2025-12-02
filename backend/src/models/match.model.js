import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  user2: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  // Skill offered by user1
  skill1: {
    type: String,
    required: true
  },
  // Skill offered by user2
  skill2: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  }
  ,
  // Hours requested by user1 (sender) to learn from user2
  requestedHoursUser1: {
    type: Number,
    default: null,
  },
  // Hours requested by user2 (responder) to learn from user1 (set when accepting)
  requestedHoursUser2: {
    type: Number,
    default: null,
  },
  // Progress tracking: how many hours each user has learned so far
  taughtHoursUser1: {
    type: Number,
    default: 0,
  },
  taughtHoursUser2: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true
});

export const Match = mongoose.model("Match", matchSchema);
