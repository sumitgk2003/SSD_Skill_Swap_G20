import mongoose from "mongoose";

const matchSchema=new mongoose.Schema({
  user1:{
    type:mongoose.Schema.ObjectId,
    ref:"User"
  },
  user2:{
    type:mongoose.Schema.ObjectId,
    ref:"User"
  },
  skill1:{
    type:String
  },
  skill2:{
    type:String
  }
},{
  timestamps:true
});

export const Match=mongoose.model("Match",matchSchema);

