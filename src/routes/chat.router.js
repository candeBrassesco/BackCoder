import { Router } from "express";
import { chatAuth } from "../middlewares/auth.middleware.js";
import { getMessagesController } from "../controllers/messages.controller.js";

const router = Router()

router.get("/", chatAuth, getMessagesController)

export default router