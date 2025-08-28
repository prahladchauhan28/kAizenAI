import express from "express";
import authMiddleware from "../middlewears/auth.middlerwear.js";
import {createChat, getChats, getMessages} from "../controllers/chat.controller.js";

const router = express.Router();

// Create a new chat api
router.post("/chat", authMiddleware, createChat);

/* GET /api/chat/ */
router.get('/', authMiddleware, getChats)


/* GET /api/chat/messages/:id */
router.get('/messages/:id', authMiddleware, getMessages)

export default router;
