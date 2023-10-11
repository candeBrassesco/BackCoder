import {Router} from 'express'
import { addProductController, deleteProductController, getProductByIdController, getProductsController, updateProductController } from '../controllers/products.controllers.js'

const router = Router()

router.get("/", getProductsController)

router.get("/:pid", getProductByIdController)

router.post('/', addProductController)

router.delete('/:pid', deleteProductController)

router.put('/:pid', updateProductController)

export default router
