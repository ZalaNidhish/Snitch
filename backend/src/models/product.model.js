import mongoose from 'mongoose'

const productSchema = mongoose.Schema({

    title: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 500,
    },
    images: {
        type: [{
            type: String
        }],
        validate: {
            validator: function (array) {
                return array.length <= 5;
            },
            message: "A product can have at most 5 images"
        }
    },
    imageIDs: {
        type: [{
            type: String
        }],
        validate: {
            validator: function (array) {
                return array.length <= 5;
            },
            message: "A product can have at most 5 images"
        }
    },
    price: {
        amount: {
            type: String,
            required: true
        },
        currency: {
            type: String,
            required: true,
            enum: ["INR", "USD"],
            default: "INR",
        }
    },
    sizes: {
        type: [{
            size: {
                type: [{
                    type: String,
                    enum: ['XS', 'SM', 'M', 'L', 'XL', 'XXL'],
                    erquired: true,
                }]
            },
            stock: {
                type: Number,
                required: true,
                min: 0,
                default: 0
            }
        }]
    },
    seller: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isListed: {
        type: Boolean,
        default: false
    }


})

export const productModel = mongoose.model("Product", productSchema)