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

//routes import
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import meetRouter from "./routes/meet.routes.js";
import zoomRouter from "./controllers/zoom.controller.js";
import adminRouter from "./routes/admin.routes.js";

//routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/meets", meetRouter);
app.use("/api/v1/zoom", zoomRouter);
app.use("/api/v1/admin", adminRouter);

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

export { server};
