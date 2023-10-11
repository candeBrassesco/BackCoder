import {Router} from 'express'
import { addCartController, addProductToCartController, deleteCartController, deleteProductOnCartController, getCartByIdController, getCartsController, updateCartController, updateQuantityController } from '../controllers/carts.controller.js'

const router = Router()

router.get('/', getCartsController)

router.get('/:cid', getCartByIdController)

router.post('/', addCartController )

router.post('/:cid/product/:pid', addProductToCartController )

router.put('/:cid', updateCartController)

router.put('/:cid/product/:pid', updateQuantityController)

router.delete('/:cid', deleteCartController)

router.delete('/:cid/product/:pid', deleteProductOnCartController)

export default router