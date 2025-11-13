import mongoose from "mongoose";

const matchSchema=new mongoose.Schema({
  meetType:{
    type:String,
    enum:["in person","online"],
    required:true
  },
  dateAndTime:{
    type:Date,
    required:true
  },
  title:{
    type:String,
    required:true
  },
  durationInMinutes:{
    type:Number,
    required:true
  }
},{
  timestamps:true
});

export const Meet=mongoose.model("Meet",matchSchema);