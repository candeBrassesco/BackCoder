import { Router } from "express";
import { loggerController } from "../controllers/logger.controller.js";

const router = new Router()

router.get("/", loggerController)

export default router