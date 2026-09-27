import {Router} from 'express'
import {cartValidator} from '../validators/cart.validator.js'
import {authenticate, authorize} from '../middlewares/auth.middleware.js'
import { addToCart } from '../controllers/cart.controller.js'
const router = Router()

router.post('/', authenticate, authorize, addToCart)

export default router;