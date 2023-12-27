import { transporter } from "../nodemailer.js";
import productManager from "../dal/dao/mongoManagers/ProductManager.js";
import userManager from "../dal/dao/mongoManagers/UserManager.js";
import logger from "../winston.js";

// get all products
export const getProductsController = async ( req, res ) => {
    try {
        const {limit = 10, page = 1, sort, ...query} = req.query
        const products = await productManager.getProducts(limit, page, sort, query)
        res.status(200).json({products})  
    } catch(error){
        res.status(500).json({error})
    }
}

// get products by ID
export const getProductByIdController = async (req, res ) => {
    const {pid} = req.params
    try {
        const product = await productManager.getProductById(pid)
        if (!product) {
          res.status(400).json({ message:'Invalid ID' })
        } else {
          res.status(200).json({ message:'Product', product })
        }
    } catch (error){
        res.status(500).json({error})
    }
}

// add a new product to the collection
export const addProductController = async ( req, res ) => {
    const {title, description, price, code } = req.body
    const {user} = req
    if ( !title || !description || !price || !code ) {
        return res.status(400).json({message: 'Some data is missing'})
    }
    try {
        if(user.role === "user") {
            res.send('Not authorized')
        }
        if(user.role === "admin") {
            const newProd = {
                ...req.body,
                owner:"admin"
            }
            const newProduct = await productManager.addProduct(newProd)
            res.status(200).json({message:'Product added', product: newProduct})
        }
        const newProd = {
            ...req.body,
            owner: user.email
        }
        const newProduct = await productManager.addProduct(newProd)
        res.status(200).json({message: 'Product added', product: newProduct})
    } catch (error) {
        res.status(500).json({error})
    }
}

// delete product of collection
export const deleteProductController = async ( req, res ) => {
    const {pid} = req.params
    const mail = pid.owner
    const product = await productManager.getProductById(pid)
    if (!product) {
       return res.status(400).json({ message:'Invalid ID' }) 
    }
    const sendEmail = async () => {
        const messagesOpt = {
            from: "coderback99@gmail.com",
            to: mail,
            subject: "Product deleted",
            html: `<p> Dear owner: Your product ID:${pid} has been deleted.</p>`,
        };
        try {
            await transporter.sendMail(messagesOpt);
        } catch (error) {
            logger.error(error);
            res.status(500).json({ message: "Error sending email" });
        }
    }
    try {
        if(product.owner && product.owner !== "admin") {
            await sendEmail()
            const deleteProduct = await productManager.deleteProduct(pid)
            return res.status(200).json({message:'Product deleted', product: deleteProduct})    
        }
        const deleteProduct = await productManager.deleteProduct(pid)
        res.status(200).json({message:'Product deleted', product: deleteProduct})
    } catch (error) {
        logger.error(error)
        res.status(500).json({message: error})
    }  
}

// get product by code (only used on supertest)
export const getByCodeController = async ( req, res ) => {
    const {code} = req.params
    const product = await productManager.getProductByCode(code)
    res.status(200).json({message: 'Product found', product: product})
}

// update product by ID
export const updateProductController = async ( req, res ) => {
    const productUpdate = req.body
    const {pid} = req.params
    if (!productUpdate) {
        return res.status(400).json({message: 'Please enter updates'})
    }
    const product = await productManager.getProductById(pid)
    if (!product) {
         res.status(400).json({ message:'Invalid ID' }) 
    }
    const update = await productManager.updateProduct(pid, productUpdate)
    const productUpdated = await productManager.getProductById(pid)
    res.status(200).json({message:'Product updated', product: productUpdated})
}

// products' handlebars view
export const viewProductsController = async ( req, res ) => {
    const {user} = req
    const {limit = 10, page = 1, sort, ...query } = req.query
    const products = await productManager.getProducts(limit, page, sort, query)
    const userLogged = await userManager.findUser(user.email)
    const productsList = products.payload.map( product => {
        return {...product, cartId: userLogged.cart, role: userLogged.role}
    })
    res.render("products", {products: productsList, user: userLogged.toObject()})
}

// add products' handlebars view
export const viewNewProductsController = async ( req, res ) => {
    res.render("newProducts")
}