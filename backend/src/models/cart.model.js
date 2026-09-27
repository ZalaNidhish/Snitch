import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({

    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        },
        size: {
            type: String,
            enum: ["XS", "S", "M", "L", "XL", "XXL"],
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

})

export const cartModel = mongoose.model("Cart", cartSchema)
