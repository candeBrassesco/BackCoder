import { Router } from "express";
import { viewNewProductsController, viewProductsController } from "../controllers/products.controllers.js";
import { addProdAuth } from "../middlewares/auth.middleware.js";
import { privateAcces } from "../middlewares/acces.middleware.js";


const router = Router()

router.get('/', privateAcces, viewProductsController)

router.get('/addProd', addProdAuth, viewNewProductsController)

export default router