import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    skill: {
      type: String,
    },
    category: {
      type: String,
    },
  },
  { timestamps: true },
);

export const Skill = mongoose.model("Skill", skillSchema);
//export default Skill;
