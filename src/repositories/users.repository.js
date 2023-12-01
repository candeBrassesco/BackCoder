import cartManager from "../dal/dao/mongoManagers/CartManager.js";
import CostumError from "../errors/CostumError.js";
import { usersModel } from "../dal/db/models/users.models.js";
import { compareData, hashData } from "../utils.js";
import { ErrorMessage, ErrorName } from "../errors/error.enum.js";
import logger from "../winston.js";


class UsersRepository {

    async createUser(user) {
        try {
            const { email, password } = user
            const userExists = await usersModel.findOne({ email })
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
                    role: 'admin'
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
            if (!user) {
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
            const cartExists = await cartManager.getCartsById(idCart)
            console.log(cartExists)
            if (!userExists || !cartExists) {
                CostumError.createError({
                    name: ErrorName.CARTUPD_DATA_INCOMPLETE,
                    message: ErrorMessage.USERCART_DATA_INCOMPLETE
                })
            }
            userUpd = await usersModel.findByIdAndUpdate({ _id: idUser }, { cart: idCart })
            return userUpd
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async updateRole(idUser) {
        try {
            const user = await usersModel.findById(idUser)
            if (!user) {
                CostumError.createError({
                    name: ErrorName.USER_DATA_INCOMPLETE,
                    message: ErrorMessage.USER_DATA_INCOMPLETE
                })
            }
            if (user.role === "admin") {
                CostumError.createError({
                    name: ErrorName.USER_DATA_INCOMPLETE,
                    message: ErrorMessage.USERROLE_DATA_INCOMPLETE
                })
            }
            if (user.role === "premium") {
                userUpd = await usersModel.findByIdAndUpdate({ _id: idUser }, { role: "user" })
                return userUpd
            }
            userUpd = await usersModel.findByIdAndUpdate({ _id: idUser }, { role: "premium" })
            return userUpd
        } catch (error) {
            logger.error(error);
            return error;
        }
    }

    async changePass(email, pass1, pass2) {
        try {
            const user = await usersModel.findOne({ email })
            if (!user) {
                CostumError.createError({
                    name: ErrorName.USER_DATA_INCOMPLETE,
                    message: ErrorMessage.USER_DATA_INCOMPLETE
                })
            }
            if (pass1 !== pass2) {
                CostumError.createError({
                    name: ErrorName.RESETPASS_DATA_INCOMPLETE,
                    message: ErrorMessage.RESETPASS_DATA_INCOMPLETE
                })
            }
            const newHashPassword = await hashData(pass1)
            if (newHashPassword === user.password) {
                CostumError.createError({
                    name: ErrorName.RESETPASS_DATA_INCOMPLETE,
                    message: ErrorMessage.NEWPASS_DATA_INCOMPLETE
                })
            }
            const userUpd = await usersModel.updateOne({ _id: user._id }, { $set: {password: newHashPassword} } )
            return userUpd
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