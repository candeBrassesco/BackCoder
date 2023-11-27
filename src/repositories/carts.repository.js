import { cartsModel } from "../dal/db/models/carts.models.js";
import { ticketsModel } from "../dal/db/models/ticket.models.js";
import { ErrorMessage, ErrorName } from "../errors/error.enum.js";
import productManager from "../dal/dao/mongoManagers/ProductManager.js";
import userManager from "../dal/dao/mongoManagers/UserManager.js"
import CostumError from "../errors/CostumError.js";
import logger from "../winston.js";


class CartsRepository {

    async getCarts() {
        try {
            const carts = await cartsModel.find({}).populate('products.pid')
            return carts
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async getCartsById(id) {
        try {
            const cart = await cartsModel.findById(id).populate('products').lean()
            if (!cart) {
                CostumError.createError({
                    name: ErrorName.CART_DATA_INCOMPLETE,
                    message: ErrorMessage.FIND_DATA_INCOMPLETE
                })
            }
            return cart
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async addCart() {
        try {
            const newCart = await cartsModel.create({})
            return newCart
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const cartById = await cartsModel.findById(cid)
            const prodById = await productManager.getProductById(pid)
            if (!cartById || !prodById) {
                CostumError.createError({
                    name: ErrorName.CARTPRODUCT_DATA_INCOMPLETE,
                    message: ErrorMessage.CARTPRODUCT_DATA_INCOMPLETE
                })
            }
            const newProduct = {
                pid: pid,
                quantity: 1,
            }
            const prodOnCart = cartById.products.find((p) => p.pid == pid)
            if (!prodOnCart) {
                cartById.products.push(newProduct)
            } else {
                prodOnCart.quantity++
            }
            const updatedCart = await cartById.save()
            return updatedCart
        } catch (error) {
            console.log(error)
            return error
        }
    }

    async deleteCart(cid) {
        try {
            const cart = await cartsModel.findById(cid)
            if (!cart) {
                CostumError.createError({
                    name: ErrorName.DELETE_DATA_INCOMPLETE,
                    message: ErrorMessage.FIND_DATA_INCOMPLETE
                })
            }
            const cartDeleted = await cartsModel.findByIdAndDelete(cid)
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async deleteProductOnCart(cid, pid) {
        try {
            const cart = await cartsModel.findById(cid)
            const prodOnCart = cart.products.find((p) => p.pid == pid)
            if (!cart || !prodOnCart) {
                CostumError.createError({
                    name: ErrorName.DELETE_DATA_INCOMPLETE,
                    message: ErrorMessage.CARTPRODUCT_DATA_INCOMPLETE
                })
            }
            const response = await cartsModel.updateOne({ _id: cid }, { $pull: { products: { pid: pid } } })
            return response
        } catch (error) {
            logger.error(error)
            return error  
        }
    }

    async updateCart(products, cid) {
        try {
            const cart = await cartsModel.findById(cid)
            if (!cart || products) {
                CostumError.createError({
                    name: ErrorName.CARTUPD_DATA_INCOMPLETE,
                    message: ErrorMessage.UPDCART_DATA_INCOMPLETE
                })
            }
            const cartToUpdate = {
                id: cid,
                products: products
            }
            return await cart.replaceOne(cartToUpdate)
        } catch (error) {
            return error
        }
    }

    async updateQuantity(quantity, cid, pid) {
        try {
            const cart = await cartsModel.findById(cid)
            const product = cart.products.find(p => p.pid == pid)
            if (!cart || !product){
                CostumError.createError({
                    name: ErrorName.CARTUPD_DATA_INCOMPLETE,
                    message: ErrorMessage.UPDCARTQUANT_DATA_INCOMPLETE
                })
            }
            const productToUpdate = {
                pid: pid,
                quantity: quantity.quantity
            }
            const indexProd = cart.products.indexOf(product)
            cart.products.splice(indexProd, 1)
            cart.products.push(productToUpdate)
            console.log(cart.products) // test
            cart.save()
            return cart
        } catch (error) {
            return error
        }
    }

    async purchaseCart(cid, user) {
        try {
            const cart = await cartsModel.findById(cid)
            const userExist = await userManager.findUser(user.email)
            if(!cart || !userExist) {
                CostumError.createError({
                    name: ErrorName.PURCHASE_DATA_INCOMPLETE,
                    message: ErrorMessage.PURCHASE_DATA_INCOMPLETE
                })
            } 
            let total = 0
            let cartProducts = cart.products
            let productsBought = []
            let productsNotBought = []
            for (let i = 0; i < cartProducts.length; i++) {
                const product = cartProducts[i]
                const dbProduct = await productManager.getProductById(product._id)
                if (product.quantity <= dbProduct.stock) {
                    let totalPrice = product.quantity * dbProduct
                    total += totalPrice
                    const newStock = dbProduct.stock - product.quantity
                    await productManager.updateProductStock(dbProduct._id, newStock)
                    productsBought.push({
                        _id: dbProduct._id,
                        quantity: product.quantity,
                        price: dbProduct.price
                    })
                } else {
                    productsNotBought.push({
                        _id: dbProduct._id,
                        quantity: product.quantity,
                        stock: dbProduct.stock
                    })
                }
            }
            if (productsNotBought.length > 0) {
                CostumError.createError({
                    name: ErrorName.STOCKPROD_DATA_INCOMPLETE,
                    message: ErrorMessage.STOCKPROD_DATA_INCOMPLETE
                })
            } else {
                const ticket = await ticketsModel.create({ purchaser: user.email, amount: total })
                return {
                    productsBought,
                    ticket
                }
            }
        } catch (error) {
            return error
        }
    }
}

const cartsRepository = new CartsRepository()
export default cartsRepository
