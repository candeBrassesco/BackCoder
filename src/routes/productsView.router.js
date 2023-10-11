import { Router } from "express";
import { viewProductsController } from "../controllers/products.controllers.js";


const router = Router()

router.get('/', viewProductsController)

export default router