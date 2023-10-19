import cartManager from "../dal/dao/mongoManagers/CartManager.js";
import { usersModel } from "../dal/db/models/users.models.js";
import { hashData } from "../utils.js";
import config from "../config.js";

class UsersRepository {

    async createUser(user) {
        try {
            const userExists = await usersModel.findOne(user.email)
            if(userExists) {
                throw new Error('The user already exists')
            } 
            if (user.email !== "adminCoder@coder.com") {
                const hashPassword = await hashData(user.password)
                usersCart = await cartManager.addCart()
                const newUser = {
                    ...user,
                    password: hashPassword,
                    cart: usersCart._id,
                }
                const userDB = await usersModel.create(newUser)
                return userDB
            } 
            const hashPassword = hashData(password)
            const newUserAd = {
                ...user,
                password: hashPassword,
                ole: "admin"
            }
            const userDB = await usersModel.create(newUserAd)
            return userDB
            
        } catch (error) {
            return error
        }
    }

    async findUser(email) {
        try {
            const user = await usersModel.findOne({ email })
            return user
        } catch (error) {
            return error
        }
    }

    async updateOne(idUser, idCart) {
        try {
            const updateUser = await usersModel.updateOne({ _id: idUser }, { $set: { cart: idCart } })
            return updateUser
        } catch (error) {
            return error
        }
    }

    async findUsersCart(email) {
        try {
            const user = await usersModel.findOne({ email })
            return user.cart
        } catch (error) {
            return error
        }
    }
}

const usersRepository = new UsersRepository()
export default usersRepository