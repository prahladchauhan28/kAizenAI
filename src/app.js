import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// APIS
// auth apis
app.use("/api/auth", authRoutes);
// chat apis
app.use("/api/chats", chatRoutes);

export default app;
