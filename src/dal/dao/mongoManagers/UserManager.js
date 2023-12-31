import usersRepository from "../../../repositories/users.repository.js"
import { usersModel } from "../../db/models/users.models.js"

class UserManager {

    async createUser(user) {
       try {
          const newUser = await usersRepository.createUser(user)
          const userDB = await usersModel.create(newUser)
          return userDB
       } catch (error) {
          return error
       }
    }

    async getUsers (limit, page, query) {
        try {
            const users = await usersRepository.getUsers(limit, page, query)
            return users
        } catch (error) {
            return error
        }
    }

    async findUser(email) {
        try {
            const user = await usersRepository.findUser(email)
            return user
        } catch (error) {
            return error
        }
    }

    async deleteUserForTest(email) {
        try {
            const delUser = await usersRepository.deleteUserForTest(email)
            return delUser
        } catch (error) {
            return error
        }
    }

    async deleteUser(email) {
        try {
            const delUser = await usersRepository.deleteUser(email)
            return delUser
        } catch (error) {
            return error
        }
    }

    async updateOne(idUser, idCart){
        try {
            const updateUser = await usersRepository.updateOne(idUser, idCart)
            return updateUser
        } catch (error) {
            return error
        }
    }

    async findUsersCart (email) {
        try {
            const usersCart = await usersRepository.findUsersCart(email)
            return usersCart
        } catch (error) {
            return error
        }
    }

    async updateRole (uid) {
        try {
            const roleChanged = await usersRepository.updateRole(uid)
            return roleChanged
        } catch (error) {
            return error
        }
    }

    async changePass (email, pass1, pass2) {
        try {
            const passChanged = await usersRepository.changePass(email, pass1, pass2)
            return passChanged
        } catch (error) {
            return error
        }
    }

    async changeLastConnection (email) {
        try {
           const newDate = await usersRepository.changeLastConnection(email)
           return newDate
        } catch (error) {
            return error
        }
    }
}

const userManager = new UserManager
export default userManager