import cartManager from "../dal/dao/mongoManagers/CartManager.js";
import CostumError from "../errors/CostumError.js";
import { usersModel } from "../dal/db/models/users.models.js";
import { hashData } from "../utils.js";
import { ErrorMessage, ErrorName } from "../errors/error.enum.js";
import logger from "../winston.js";
import config from "../config.js";


class UsersRepository {

    async createUser(user) {
        try {
           const { email, password } = user
           const userExists = await usersModel.findOne({email})
           if (userExists) {
             CostumError.createError({
                name: ErrorName.REGISTER_DATA_INCOMPLETE,
                message: ErrorMessage.REGISTER_DATA_INCOMPLETE
             })
           }
           if (email === 'adminCoder@coder.com') {
            const hashPassword = await hashData(password)
            const newUser = {
                ...user,
                password: hashPassword,
                role:'admin'
            }
            logger.warning(`Admin created: ${newUser.email}`)
            return newUser
           }
           const hashPassword = await hashData(password)
           const usersCart = await cartManager.addCart()
           const newUser = {
               ...user,
               password: hashPassword,
               cart: usersCart
           }
           logger.info(`User created: ${newUser.email}`)
           return newUser
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async findUser(email) {
        try {
            const user = await usersModel.findOne({ email })
            if(!user) {
                CostumError.createError({
                    name: ErrorName.USER_DATA_INCOMPLETE,
                    message: ErrorMessage.USER_DATA_INCOMPLETE
                })
            }
            return user
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async updateOne(idUser, idCart) {
        try {
            const userExists = await usersModel.findById(idUser)
            const cartExists = await cartManager.findById(idCart)
            if (!userExists || !cartExists) {
                CostumError.createError({
                    name: ErrorName.CARTUPD_DATA_INCOMPLETE,
                    message: ErrorMessage.USERCART_DATA_INCOMPLETE
                })
            }
            const updateUser = await usersModel.updateOne({ _id: idUser }, { $set: { cart: idCart } })
            return updateUser
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async updateRole (idUser) {
        try {
            const user = await usersModel.findById(idUser)
            if (!user) {
                CostumError.createError({
                    name: ErrorName.USER_DATA_INCOMPLETE,
                    message: ErrorMessage.USER_DATA_INCOMPLETE
                })
            }
    
            const newUser = {
                _id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            };
    
            if (user.role === "premium") {
                newUser.role = "user";
            } else {
                newUser.role = "premium";
            }
    
            const userDelete = await usersModel.deleteOne({ _id: idUser });
            const userDb = await usersModel.create(newUser);
    
            return userDb;
        } catch (error) {
            logger.error(error);
            return error;
        }
    }

    async changeRole (idUser) {
        try {
            const user = await usersModel.findById(idUser)
            if (!user) {
                CostumError.createError({
                    name: ErrorName.USER_DATA_INCOMPLETE,
                    message: ErrorMessage.USER_DATA_INCOMPLETE
                })
            }
            if(user.role === "premium") {
                const updateUser = await usersModel.updateOne({ _id: idUser }, { $set: { role: "user"} })
                return updateUser
            }
            const updateUser = await usersModel.updateOne({ _id: idUser }, { $set: { cart: "premium" } })
            return updateUser
        } catch (error) {
            logger.error(error)
            return error
        }
    }
   
    async findUsersCart(email) {
        try {
            const user = await usersModel.findOne({ email })
            if (!user) {
                CostumError.createUser({
                    name: ErrorName.USER_DATA_INCOMPLETE,
                    message: ErrorMessage.FIND_DATA_INCOMPLETE
                })
            }
            return user.cart
        } catch (error) {
            logger.error(error)
            return error
        }
    }
}

const usersRepository = new UsersRepository()
export default usersRepository