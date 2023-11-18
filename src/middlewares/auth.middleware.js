import productManager from "../dal/dao/mongoManagers/ProductManager.js"

export const addProdAuth = async ( req, res, next ) => {
    try {
        const {user} = req
        if (user.role === "user") {
            res.status(401).json({message: 'Not authorized'})
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
            res.status(401).json({message:'Not authorized'})
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
           res.status(401).json({message:'Not authorized'})
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
            res.status(401).json({message:'Not authorized'})
        }
        if(user.role ==="premium" && product.owner !== user.email) {
            res.status(401).json({message: 'Not authorized'})
        }
        next() 
    } catch(error) {
        return error
    }
}

export const changeRolAuth = async ( req, res, next ) => {
    try {
        const {user} = req
        if(user.role === "admin") {
            res.status(401).json({message: 'Not authorized'})
        }
    } catch (error) {
        return error
    }
}




