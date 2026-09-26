import {body, validationResult} from 'express-validator'

export const registerValidator = [
    
    body('email')
    .exists().withMessage("Email is required.").bail()
    .trim()
    .isEmail().withMessage("Invalid Email Format.").bail(),

    body('name')
    .exists().withMessage("Name is Required.").bail()
    .trim()
    .isString().withMessage("Name must be a String.").bail()
    .isLength({min: 2, max: 50}).withMessage("Name Length must be between 2 to 50 characters.").bail(),

    body('password')
    .exists().withMessage("Password is Required.").bail()
    .trim()
    .isString().withMessage("Password must be a String.").bail()
    .isLength({min: 6}).withMessage("Password must be atleast 6 characters long."),

    (req, res, next)=>{

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                message: "Invalid Request",
                errors: errors.array()
            })
        }

        next();

    }
]

export const loginValidator = [

    body('email')
    .exists().withMessage("Email is required.").bail()
    .trim()
    .isEmail().withMessage("Invalid Email Format.").bail(),

    body('password')
    .exists().withMessage("Password is Required.").bail()
    .trim()
    .isString().withMessage("Password must be a String.").bail(),

    (req, res, next) => {

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({
                message: "Invalid Request",
                errors: errors.array()
            })
        }

        next();

    }

]