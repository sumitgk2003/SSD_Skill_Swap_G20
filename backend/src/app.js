import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// --- SOCKET.IO SETUP ---
const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "http://localhost:5173", // Best to match your specific frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// 1. Create a Map to store online users: { userId: socketId }
const userSocketMap = {}; 

// 2. Define the helper function your Controller needs
export const Reciever = (receiverId) => {
  return userSocketMap[receiverId];
};

// 3. Handle Socket Connections
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // We expect the frontend to send userId in the query: io({ query: { userId: "..." } })
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
  }

  // Optional: Emit list of online users to all clients so you can show green dots/status
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle Disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import meetRouter from "./routes/meet.routes.js";
import zoomRouter from "./controllers/zoom.controller.js";
import messageRouter from "./routes/message.routes.js"; 
import adminRouter from "./routes/admin.routes.js";
import sessionRouter from "./routes/session.routes.js";
import reviewRouter from "./routes/review.routes.js";
import disputeRouter from "./routes/dispute.routes.js";
import notificationRouter from './routes/notification.routes.js';

app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/meets", meetRouter);
app.use("/api/v1/zoom", zoomRouter);
app.use("/api/v1/admin", adminRouter);

app.use("/api/v1/messages", messageRouter);
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/disputes', disputeRouter);
app.use('/api/v1/notifications', notificationRouter);

// 5. Export 'io' and 'Reciever' so the Controller can import them
export { app, io, server };
