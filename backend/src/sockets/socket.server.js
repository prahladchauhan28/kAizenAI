import { Server } from "socket.io";
import cookie from "cookie";
import jwt from "jsonwebtoken";
import Usermodel from "../models/auth.model.js";
import { generateResponse, generateVectors } from "../services/ai.service.js";
import messageModel from "../models/message.model.js";
import { createChatMemory, queryMemory } from "../services/vector.service.js";
import cors from "cors";

function initSocketServer(httpserver) {
  const io = new Server(httpserver, {
    //  CORS middleware
      cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }
  });



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

      // Save the user message and its vectors
      const [messagevector, vectors] = await Promise.all([
        messageModel.create({
          user: socket.user._id,
          chat: message.chat,
          content: message.content,
          role: "user",
        }),
        generateVectors(message.content),
      ]);

      // Save the message vector and its metadata
      await createChatMemory({
        vectors,
        message_id: messagevector._id,
        metadata: {
          chat: message.chat,
          user: socket.user._id,
          text: message.content,
        },
      });

      // retrieve memory and chat history
      const [memory, chatHistory] = await Promise.all([
        queryMemory({
          queryVectors: vectors,
          limit: 3,
          metadata: {},
        }),
        messageModel
          .find({
            chat: message.chat,
          })
          .sort({ createdAt: -1 })
          .limit(20)
          .lean()
          .exec(),
      ]);

      // Short term memory (mongodb)
      const stm = chatHistory.map((item) => {
        return {
          role: item.role,
          parts: [{ text: item.content }],
        };
      });
      // long term memory (pineconeDB)
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

      // Generate a response from the AI
      const response = await generateResponse([...ltm, ...stm]);

      // Send the response back to the client
      socket.emit("ai-response", {
        content: response,
        chat: message.chat,
      });

      // Save the response message and vectors
      const [responseMessage, responseVectors] = await Promise.all([
        messageModel.create({
          user: socket.user._id,
          chat: message.chat,
          content: response,
          role: "model",
        }),
        generateVectors(response),
      ]);

      // Save the response message and vectors in DB
      await createChatMemory({
        vectors: responseVectors,
        message_id: responseMessage._id,
        metadata: {
          chat: message.chat,
          user: socket.user._id,
          text: response,
        },
      });
    });
  });
}

export default initSocketServer;
