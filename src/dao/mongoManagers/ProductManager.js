import { productsModel } from "../../db/models/products.models.js";

class ProductManager {

    async getProducts(limit, page, sort, query){
        try {
            const options = {
                limit: limit,
                page: page,
                sort: sort ? {price:sort} : {},
                lean: true
            }
            const result = await productsModel.paginate (
                query,
                options
            )
            const info = {
                status: "success",
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage === false ? null : `http://localhost:8080/api/products?page=${result.prevPage}`,
                nextLink: result.hasPrevPage === false ? null : `http://localhost:8080/api/products?page=${result.nextPage}` 
            }
            return info
        } catch (error) {
            const resultError = {status: "error"}
            return resultError
        }
    }
    async addProduct(obj) {
        try {
            const newProduct = await productsModel.create(obj)
            return newProduct
        } catch (error) {
            return error
        }
    }
    async getProductById(id) {
        try {
            const product = await productsModel.findById(id)
            return product
        } catch (error) {
            return error
        }
    }
    async deleteProduct(id) {
        try {
            const deleteProduct = await productsModel.findByIdAndDelete(id)
            return deleteProduct
        } catch (error) {
            return error
        }
    }
    async updateProduct(id, obj) {
        try {
            const productUpdate = await productsModel.updateOne( { _id: id }, { ...obj } )
            return productUpdate
        } catch (error) {
            return error
        }
    }
}

const productManager = new ProductManager()
export default productManager