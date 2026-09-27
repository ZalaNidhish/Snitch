import express from 'express';
const router = express.Router();
import {createProductController, deleteProductController, getAllProductController, getAllSellerProductController, listProductController, unlistProductController} from '../controllers/product.controller.js'
import {authenticate, authorize} from '../middlewares/auth.middleware.js'
import {listProductValidator, productValidator, unlistProductValidator} from '../validators/product.validator.js'
import multer from 'multer'

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        files: 5,
        fileSize: 1*1024*1024, // 1mb
    }
})

//all products
router.get('/seller', authenticate, authorize, getAllSellerProductController)

router.get('/', authenticate, getAllProductController)

//List products

router.post('/list/:id', authenticate, authorize, listProductValidator, listProductController)

router.post('/unlist/:id', authenticate, authorize, unlistProductValidator, unlistProductController)

//create product
router.post('/', authenticate, authorize, upload.array("images"), (req, res, next)=>{
    req.body.price && (req.body.price = JSON.parse(req.body.price));
    req.body.sizes && (req.body.sizes = JSON.parse(req.body.sizes));
    next();
}, productValidator, createProductController);


// delete product

router.delete('/:id', authenticate, authorize,  deleteProductController);


export default router;