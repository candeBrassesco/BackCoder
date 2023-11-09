import {Router} from 'express'
import { addProductController, deleteProductController, getProductByIdController, getProductsController, updateProductController } from '../controllers/products.controllers.js'
import { addProdAuth, delOrUpAuth } from '../middlewares/auth.middleware.js'

const router = Router()

router.get("/", getProductsController)

router.get("/:pid", getProductByIdController)

router.post('/', addProdAuth, addProductController)

router.delete('/:pid', delOrUpAuth, deleteProductController)

router.put('/:pid', delOrUpAuth, updateProductController)

export default router
