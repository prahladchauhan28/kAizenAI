import express from "express";
import authMiddleware from "../middlewears/auth.middlerwear.js";
import createChat from "../controllers/chat.controller.js";

const router = express.Router();

// Create a new chat api
router.post("/chat", authMiddleware, createChat);

export default router;
