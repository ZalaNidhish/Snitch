import {cartModel} from '../models/cart.model.js'
import {productModel} from '../models/product.model.js'

export const addToCart = async (req, res)=>{
    const {productID, quantity, size} = req.body

    const product = await productModel.findById(productID);

    if(!product){
        return res.status(404).json({
            message: "Product not found"
        })
    }

    const selectedSizes = product.sizes.find(s=>s.size==size)

    if(!selectedSizes){
        return res.status(400).json({
            message: "Invalid size"
        })
    }

    if(selectedSizes.stock < quantity) {
        return res.status(400).json({
            message: "Insufficient stock"
        })
    }

    const cart = await cartModel.findOne({user: req.user.userID}) ?? await cartModel.create({user: req.user.userID})

    const isProductAlreadyInCart = cart.products.find(p=>(p.product.toString() == productID) && p.size == size)

    if(isProductAlreadyInCart){
        if(isProductAlreadyInCart.quantity + quantity > selectedSizes.quantity){
            return res.status(400).json({
                message: "Insufficient stock",
            })
        }

        await cartModel.updateOne(
            {
                user: req.user.userID,
                "products.product": productID,
                "product.size": size 
            },
            {
                $inc: {
                    "products.$.quantity": quantity,
                }
            }
        )

        return res.status(200).json({
            message: "Product quantity updated successfully in cart"
        })
    }

    await cartModel.findOneAndUpdate({user: req.user.userID}, {
        $push: {
            products: {
                product: productID,
                quantity: quantity,
                size: size
            }
        }
    })

    return res.status(200).json({
        message: "Product added to cart successfully"
    })
   
}