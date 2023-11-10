import { productsModel } from "../dal/db/models/products.models.js";
import { ErrorName, ErrorMessage } from "../errors/error.enum.js";
import CostumError from "../errors/CostumError.js";
import logger from "../winston.js";

class ProductsRepository {

    async getProducts(limit, page, sort, query) {
        try {
            const options = {
                limit: limit,
                page: page,
                sort: sort ? { price: sort } : {},
                lean: true
            }
            const result = await productsModel.paginate(
                query,
                options
            )
            if (!result || !options) {
                CostumError.createError({
                    name: ErrorName.PRODUCT_DATA_INCOMPLETE,
                    message: ErrorMessage.PRODUCT_DATA_INCOMPLETE
                })
            }
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
            const resultError = { status: "error" }
            logger.error(resultError)
            return resultError
        }
    }

    async addProduct(obj) {
        try {
            const newProduct = await productsModel.create(obj)
            logger.warning('New product added')
            return newProduct
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async findProductById(id) {
        try {
            const product = await productsModel.findById(id)
            if (!product) {
                CostumError.createError({
                    name: ErrorName.PRODUCT_DATA_INCOMPLETE,
                    message: ErrorMessage.FIND_DATA_INCOMPLETE
                })
            }
            return product
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async deleteProduct(id) {
        try {
            const productExist = await productsModel.findById(id)
            if (!productExist) {
                CostumError.createError({
                    name: ErrorName.DELETE_DATA_INCOMPLETE,
                    message: ErrorMessage.FIND_DATA_INCOMPLETE
                })
            }
            const deleteProduct = await productsModel.findByIdAndDelete(id)
            logger.warning(`Product ${productExist} deleted`)
            return deleteProduct
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async updateProduct(id, obj) {
        try {
            const productExist = await productsModel.findById(id)
            if (!productExist) {
                CostumError.createError({
                    name: ErrorName.PRODUCTUPD_DATA_INCOMPLETE,
                    message: ErrorMessage.FIND_DATA_INCOMPLETE
                })
            }
            const productUpdate = await productsModel.updateOne({ _id: id }, { ...obj })
            logger.warning(`Product ${productExist} updated`)
            return productUpdate
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async updateProductStock(id, stock) {
        try {
            const productExist = await productsModel.findById(id)
            if (!productExist || !stock) {
                CostumError.createError({
                    name: ErrorName.PRODUCTUPD_DATA_INCOMPLETE,
                    message: ErrorMessage.PRODUCTUPDSTOCK_DATA_INCOMPLETE
                })
            }
            const result = await productsModel.findOneAndUpdate(
                { _id: id },
                { stock: stock },
                { new: true }
            )
            logger.info(`Stock ${productExist} updated`)
            return result
        } catch (error) {
            logger.error(error)
            return error
        }
    }
}


const productsRepository = new ProductsRepository()

export default productsRepository