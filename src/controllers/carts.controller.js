import cartManager from "../dal/dao/mongoManagers/CartManager.js";
import { cartsModel } from "../dal/db/models/carts.models.js";

// get all carts
export const getCartsController = async ( req, res ) => {
    try {
        const carts = await cartManager.getCarts()
        res.status(200).json({carts})
    } catch (error) {
        res.status(500).json({error})
    }
}

// get one cart by ID
export const  getCartByIdController = async ( req, res ) => {
    const {cid} = req.params
    try {
        const cartById = await cartManager.getCartsById(cid)
        res.status(200).json({message:'Cart', cartById})
    } catch (error) {
        res.status(500).json({error})
    }
}

// add a new cart
export const addCartController = async ( req, res ) => {
    try {
        const newCart = await cartManager.addCart(req.body)
        res.status(200).json({message: 'Cart added', cart: newCart})
    } catch (error) {
        res.status(500).json({error})
    }
}

// add product to a certain cart
export const addProductToCartController = async ( req, res ) => {
    const {cid, pid} = req.params
    try {
        const newProductAdded = await cartManager.addProductToCart(cid, pid)
        res.status(200).json({message: 'Product added to cart', product: newProductAdded}) 
    } catch (error) {
        res.status(500).json({error})
    }
}

// update cart
export const updateCartController = async ( req, res ) => {
    const {cid} = req.params
    const products = req.body
    try {
        const response = await cartManager.updateCart(products, cid)
        const cartUp = await cartManager.getCartsById(cid)
        res.status(200).json({message:'Cart updated', cartUp})
    } catch (error){
        res.status(500).json({error})
    }
}

// update quantity of a product on cart
export const updateQuantityController = async ( req, res ) => {
    const {cid, pid} = req.params
    const quantity = req.body
    try {
        const productUpdated = await cartManager.updateQuantity(quantity, cid, pid)
        const cart = await cartManager.getCartsById(cid)
        res.status(200).json({message: 'Quantity updated. Cart updated', cart})
    } catch (error){
        res.status(500).json({error})
    }
}

// delete a cart by ID
export const deleteCartController = async ( req, res ) => {
    const {cid} = req.params
    try {
        const response = await cartManager.deleteCart(cid)
        const newCartsList = await cartManager.getCarts()
        res.status(200).json({message:'Cart deleted. New cart list.', newCartsList})
    } catch (error){
        res.status(500).json({error})
    }
}

// delete products on cart
export const deleteProductOnCartController = async ( req, res ) => {
    const {cid, pid} = req.params
    try {
        const cart = await cartManager.getCartsById(cid)
        const prodOnCart = cart.products.find((p) => p.pid == pid)
        if(!prodOnCart) {
            res.status(500).json({error})
        }
        const response = await cartManager.deleteProductOnCart(cid, pid)
        res.status(200).json({message: 'Product deleted', response})
    } catch (error) {
        res.status(500).json({error})
    }
}

// carts' handlebars view
export const viewCartControler = async ( req, res ) => {
    const {cid} = req.params
    try {
        const cart = await cartManager.getCartsById(cid)
        console.log(cart)
        const cartProducts = cart.products
        const productList = cartProducts.map(product => {
            return {
                title: product.pid.title,
                price: product.pid.price,
                code: product.pid.code,
                thumbnails: product.pid.thumbnails,
                quantity: product.quantity
              };
        })
        console.log(productList) 
        res.render("cart", {products: productList, cartId: cid})
    } catch (error) {
        res.status(500).json({error})
    }
}

// purchase cart and generate a ticket
export const purchaseCartController = async ( req, res ) => {
    const {cid} = req.params
    const {user} = req
    try {
        const purchase = await cartManager.purchaseCart(cid, user)
        const resetCart = await cartManager.resetCart(cid)
        const ticket = purchase.ticket
        res.render("ticket", {
            code: ticket.code,
            amount: ticket.amount,
            productsBought: purchase.productsBought
        })
    } catch (error) {
        res.status(500).json({error})
    }
}

