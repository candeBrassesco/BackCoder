import usersRepository from "../../../repositories/users.repository.js"

class UserManager {

    async createUser(user) {
       try {
          const newUser = await usersRepository.createUser(user)
          return newUser
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

    async updateOne(idUser, idCart){
        try {
            const updateUser = await usersRepository(idUser, idCart)
            return updateUser
        } catch (error) {
            return error
        }
    }

    async findUsersCart (email) {
        try {
            const usersCart = await usersRepository(email)
            return usersCart
        } catch (error) {
            return error
        }
    }
}

const userManager = new UserManager
export default userManager