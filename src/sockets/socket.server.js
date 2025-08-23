import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import Usermodel from "../models/auth.model.js";
import { generateResponse, generateVectors } from "../services/ai.service.js";
import messageModel from "../models/message.model.js";
import { createChatMemory, queryMemory } from "../services/vector.service.js";

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
      const messagevector = await messageModel.create({
        user: socket.user._id,
        chat: message.chat,
        content: message.content,
        role: "user",
      });

      const vectors = await generateVectors(message.content);
      // console.log("Message Vectors:", vectors);

      const memory = await queryMemory({
        queryVectors: vectors,
        limit: 3,
        metadata: {
        },
      });
      await createChatMemory({
        vectors,
        message_id: messagevector._id,
        metadata: {
          chat: message.chat,
          user: socket.user._id,
          text: message.content,
        },
      });
      console.log(memory);

      // const chatHistory = await messageModel.find({ chat: message.chat });

      // Short term memory (mongodb)
      const chatHistory = (
        await messageModel
          .find({
            chat: message.chat,
          })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
      ).reverse();

      const stm = chatHistory.map((item) => {
        return {
          role: item.role,
          parts: [{ text: item.content }],
        };
      });

      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: `
                        these are some previous messages from the chat, use them to generate a response
                        ${memory.map((item) => item.metadata.text).join("\n")}
                    `,
            },
          ],
        },
      ];

      console.log(ltm[0]);
      console.log(stm);

      const response = await generateResponse([...ltm, ...stm]);

      const responseMessage = await messageModel.create({
        user: socket.user._id,
        chat: message.chat,
        content: response,
        role: "model",
      });

      const responseVectors = await generateVectors(response);
      // console.log("Response Vectors:", responseVectors);

      await createChatMemory({
        vectors: responseVectors,
        message_id: responseMessage._id,
        metadata: {
          chat: message.chat,
          user: socket.user._id,
          text: response,
        },
      });

      socket.emit("ai-response", {
        content: response,
        chat: message.chat,
      });
    });
  });
}

export default initSocketServer;
