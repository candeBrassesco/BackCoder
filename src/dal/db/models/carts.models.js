import mongoose from "mongoose"

const cartsSchema = new mongoose.Schema({
    products:
        [{
            pid:{
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Products"
            },
            quantity: {type: Number},
            _id: false
        }]
})

export const cartsModel = mongoose.model('Carts', cartsSchema)