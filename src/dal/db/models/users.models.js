import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    age: {
        type: Number,
        required: true,
        default: 0
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user',
    },
    cart: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Carts'
    },
    last_connection: {
        type: Date,
        default: null
    }
})

usersSchema.plugin(mongoosePaginate)

export const usersModel = mongoose.model('Users', usersSchema)