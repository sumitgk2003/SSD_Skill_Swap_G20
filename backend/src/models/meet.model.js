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
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match' },
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
  // Organizer's role: 'teach' if organizer is teaching, 'learn' if organizer is learning
  organizerRole: { type: String, enum: ['teach', 'learn'], default: null },
  // Skill being taught in this meet (persisted for clarity)
  skillBeingTaught: { type: String, default: null },
  googleEventId: { type: String, default: null },
  attendees: { type: [String], default: [] },
  googleEventHtmlLink: { type: String, default: null },
  zoomMeetingId: { type: String, default: null },
  zoomJoinUrl: { type: String, default: null },
});

export const Meet=mongoose.model("Meet",matchSchema);
