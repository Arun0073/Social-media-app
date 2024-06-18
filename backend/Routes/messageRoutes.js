import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {getConversations, getMessages, sendMessages} from "../controllers/messageController.js";

const router = express.Router();

router.get("/conversations", protectRoute, getConversations);
router.get("/:otherUserId", protectRoute, getMessages);
router.post("/", protectRoute, sendMessages);

export default router;
