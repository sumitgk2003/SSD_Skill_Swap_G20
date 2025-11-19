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
}, {
  timestamps: true
});

export const Match = mongoose.model("Match", matchSchema);
