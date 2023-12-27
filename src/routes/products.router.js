import {Router} from 'express'
import { addProductController, deleteProductController, getByCodeController, getProductByIdController, getProductsController, updateProductController } from '../controllers/products.controllers.js'
import { addProdAuth, delOrUpAuth } from '../middlewares/auth.middleware.js'

const router = Router()

router.get("/", getProductsController)

router.get("/:pid", getProductByIdController)

router.get('/code/:code', getByCodeController)

router.post('/', addProdAuth, addProductController)

router.post('/:pid', delOrUpAuth, deleteProductController)

router.put('/:pid', delOrUpAuth, updateProductController)

export default router
