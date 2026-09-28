import {body, param, validationResult} from 'express-validator'

export const productValidator = [
    
    body('title')
    .exists().withMessage("Title is required").bail()
    .trim()
    .isString().withMessage("Title should be a string").bail()
    .isLength({min: 2, max: 30}).withMessage("Product title should contain 2 to 30 characters").bail(),

    body('description')
    .exists().withMessage("Description is required").bail()
    .trim()
    .isString().withMessage("Description should be a string").bail()
    .isLength({min: 10, max: 500}).withMessage("Product description must be between 10 to 500 long"),

    body('price.amount')
    .exists().withMessage("Price Amount is required.").bail()
    .isFloat({min: 0}).withMessage("Price amount must be floating number with min value 0").bail(),

    body('price.currency')
    .exists().withMessage("Currenct is required").bail()
    .isString().withMessage("Currency must be a string value")
    .isIn(["INR", "USD"]).withMessage("Currency must be INR or USD").bail(),

    body('sizes')
    .exists().withMessage("Sizes are required.").bail()
    .isArray().withMessage("Sizes should be an Array").bail(),

    body('sizes.*.size')
    .exists().withMessage("Size is requied in sizes").bail()
    .trim()
    .isString().withMessage("Size must be a string value").bail()
    .isIn(['XS', 'M', 'L', 'XL', 'XXL']).withMessage("Size should be from XS to XXL only").bail(),

    body('sizes.*.stock')
    .exists().withMessage("Stock is required for every size").bail()
    .isInt({min: 0}).withMessage("Stock must be an integral value with min 0.").bail(),


    (req, res, next) => {

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                message: "Invalid Product Data.",
                errors
            })
        }

        next()

    }
    
]

// Update = same body rules as create + the :id in the URL must be a valid Mongo id
export const updateProductValidator = [

    param('id')
    .exists().withMessage("Product id is required").bail()
    .isMongoId().withMessage("Product id is not valid mongo id"),

    ...productValidator
]

export const listProductValidator = [

    param('id')
    .exists().withMessage("Product id is required").bail()
    .isMongoId().withMessage("Product is is not valid mongo id"),

    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                message: "Error in product id",
                errors
            })
        }
        next()
    }

]


export const unlistProductValidator = [

    param('id')
    .exists().withMessage("Product id is required").bail()
    .isMongoId().withMessage("Product is is not valid mongo id"),

    (req, res, next) => {
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                message: "Error in product id",
                errors: errors.array()
            })
        }
        next()
    }

]