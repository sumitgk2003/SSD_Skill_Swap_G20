import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

// Create the HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.io with CORS allowed (adjust origin for your frontend URL)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"], // React/Vite default ports
    methods: ["GET", "POST"],
  },
});

// Store online users: { userId: socketId }
const userSocketMap = {};

// This is the function imported in your controller
export const Reciever = (userId) => {
  return userSocketMap[userId];
};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Get userId from the query params sent by the frontend
  const userId = socket.handshake.query.userId;

  // If user exists, map their ID to this socket
  if (userId !== "undefined") userSocketMap[userId] = socket.id;

  // Broadcast list of online users to all clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
