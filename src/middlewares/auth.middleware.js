import productManager from "../dal/dao/mongoManagers/ProductManager.js"
import { usersModel } from "../dal/db/models/users.models.js"

export const addProdAuth = async ( req, res, next ) => {
    try {
        const {user} = req
        if (user.role === "user") {
            res.status(400).json({message: 'Not authorized'})
        }
        next()
    } catch (error) {
        return error
    }
}

export const chatAuth = async ( req, res, next ) => {
    try {
        const {user} = req
        if(user.role === "admin") {
            res.status(400).json({message:'Not authorized'})
        }
        next()
    } catch (error) {
        return error
    }
}

export const addProdCartAuth = async ( req, res, next ) => {
    try {
        const {user} = req
        const {pid} = req.params
        const product = await productManager.getProductById(pid)
        if (user.role === "admin" || user.email === product.owner) {
           res.status(400).json({message:'Not authorized'})
        }
        next()
    } catch (error) {
        return error
    }
}

export const delOrUpAuth = async ( req, res, next ) => {
    try {
        const {user} = req
        const {pid} = req.params
        const product = await productManager.getProductById(pid)
        if(user.role === "user") {
            res.status(400).json({message:'Not authorized'})
        }
        if(user.role ==="premium" && product.owner !== user.email) {
            res.status(400).json({message: 'Not authorized'})
        }
        next() 
    } catch(error) {
        return error
    }
}

export const changeRolAuth = async ( req, res, next ) => {
    try {
        const {uid} = req.params
        const user = await usersModel.findById(uid)
        if(user.role === "admin") {
            res.status(400).json({message: 'Not authorized'})
        }
    } catch (error) {
        return error
    }
}




