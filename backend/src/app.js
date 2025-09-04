import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import cors from "cors"

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
));

// APIS
// auth apis
app.use("/api/auth", authRoutes);
// chat apis
app.use("/api/chats", chatRoutes);

export default app;
