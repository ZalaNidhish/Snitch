import {body, validationResult} from 'express-validator'

export const cartValidator = [

    body('productID')
    .exists().withMessage("Product ID not found").bail()
    .isMongoId().withMessage("Product id is not valid id").bail(),

    body('quantity')
    .exists().withMessage("Product quantity is required").bail()
    .isInt().withMessage("Quantity must be integer greater then zero").bail(),

    body('size')
    .exists().withMessage("Size must be a string").bail()
    .isString().withMessage("Size must be a string").bail()
    .isIn(['XS', 'S', 'M', 'L', 'XL', 'XXL']).withMessage("Invalid Size").bail(),

    (req, res, next) => {
        const errors  = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                message: "Invalid cart data",
                errors: errors.array()
            })
        }
    }

]