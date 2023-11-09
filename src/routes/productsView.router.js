import { Router } from "express";
import { viewNewProductsController, viewProductsController } from "../controllers/products.controllers.js";
import { addProdAuth } from "../middlewares/auth.middleware.js";


const router = Router()

router.get('/', viewProductsController)

router.get('/addProd', addProdAuth, viewNewProductsController)

export default router