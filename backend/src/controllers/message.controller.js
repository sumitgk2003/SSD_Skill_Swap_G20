import { User } from "../models/user.model.js";
import Message from "../models/message.model.js";
import { Match } from "../models/match.model.js";
import { io, Reciever } from "../app.js";

export const getMessagesById = async (req, res) => {
  try {
    // NOW: Takes matchId from body
    const { matchId } = req.body;

    if (!matchId) {
      return res.status(400).json({ message: "Match ID is required" });
    }

    // Find messages belonging to this specific match
    const messages = await Message.find({
      matchId: matchId,
    }).select("-password");

    res.status(200).json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error in getMessagesById function" });
  }
};

export const sendMessage = async (req, res) => {
  const { matchId, text } = req.body; // Changed to take matchId and text
  try {
    // Removed image handling

    // Find the match to get the recipient's ID
    const match = await Match.findById(matchId);
    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    let recieverId;
    if (match.user1.toString() === req.user._id.toString()) {
      recieverId = match.user2;
    } else if (match.user2.toString() === req.user._id.toString()) {
      recieverId = match.user1;
    } else {
      return res.status(403).json({ message: "You are not part of this match" });
    }

    const newMessage = new Message({
      sendersId: req.user._id,
      recieversId: recieverId, // Use the determined recieverId
      matchId: matchId, // Associate message with the match
      text,
    });

    await newMessage.save();

    const recSocketId = Reciever(recieverId); // Use recieverId
    if (recSocketId) io.to(recSocketId).emit("newMessage", newMessage);

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error in sendMessage function" });
  }
};

