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

// Organizer and Google event id for calendar sync
matchSchema.add({
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  googleEventId: { type: String, default: null },
  attendees: { type: [String], default: [] },
  googleEventHtmlLink: { type: String, default: null },
  zoomMeetingId: { type: String, default: null },
  zoomJoinUrl: { type: String, default: null },
});

export const Meet=mongoose.model("Meet",matchSchema);