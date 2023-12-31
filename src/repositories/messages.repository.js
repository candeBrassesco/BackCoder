import { messagesModel } from "../dal/db/models/messages.models.js";
import logger from "../winston.js";

class MessageRepository {
    
    async getMessages () {
        try {
            const messages = await messagesModel.find()
            return messages
        } catch (error) {
            logger.error(error)
            return error
        }
    }

    async createMessages (message) {
        try {
            const newMessage = await messagesModel.create(message)
            return newMessage
        } catch (error) {
            logger.error(error)
            return error
        }
    }
} 

const messageRepository = new MessageRepository()
export default messageRepository