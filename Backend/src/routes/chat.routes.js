import { Router } from 'express';
import multer from 'multer';
import { sendMessage, getChats, getMessages, deleteChat } from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

// Configure multer for file uploads
const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

const chatRouter = Router();


chatRouter.post("/message", authUser, upload.array("files", 10), sendMessage)

chatRouter.get("/", authUser, getChats)

chatRouter.get("/:chatId/messages", authUser, getMessages)

chatRouter.delete("/delete/:chatId", authUser, deleteChat)

export default chatRouter;