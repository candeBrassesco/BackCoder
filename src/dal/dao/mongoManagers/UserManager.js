import { usersModel } from "../../db/models/users.models.js"

class UserManager {

    async createUser(user) {
       try {
          const newUser = await usersModel.create(user)
          return newUser
       } catch (error) {
          return error
       }
    }

    async findUser(email) {
        try {
            const user = await usersModel.findOne({email})
            return user
        } catch (error) {
            return error
        }
    }

    async updateOne(idUser, idCart){
        try {
            const updateUser = await usersModel.updateOne({_id:idUser},{$set:{cart:idCart}})
            return updateUser
        } catch (error) {
            return error
        }
    }
}

const userManager = new UserManager
export default userManager