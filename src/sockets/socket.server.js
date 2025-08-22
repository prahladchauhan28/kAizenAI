import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import Usermodel from "../models/auth.model.js";
import { generateResponse } from "../services/ai.service.js";
import messageModel from "../models/message.model.js";

function initSocketServer(httpserver) {
  const io = new Server(httpserver, {});

  // Middleware for authentication
  io.use(async (socket, next) => {
    const cookies = cookie.parse(socket.request.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await Usermodel.findById(decoded.id);
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("ai-message", async (message) => {
      // console.log("message received:", message);

      await messageModel.create({
        user: socket.user._id,
        chat: message.chat,
        content: message.content,
        role: "user",
      });

      const chatHistory = await messageModel.find({ chat: message.chat });

      const response = await generateResponse(
        chatHistory.map((item) => {
          return {
            role: item.role,
            parts: [{ text: item.content }],
          };
        }));

      await messageModel.create({
        user: socket.user._id,
        chat: message.chat,
        content: response,
        role: "model",
      });

      socket.emit("ai-response", {
        content: response,
        chat: message.chat,
      });
    });
  });
}

export default initSocketServer;
