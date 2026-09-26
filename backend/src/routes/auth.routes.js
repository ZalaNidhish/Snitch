import express from 'express';
import { loginValidator, registerValidator } from '../validators/auth.validator.js';
import { getmeController, loginController, logoutController, refreshController, registerController } from '../controllers/auth.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
const router = express.Router();


/**
 * @POST /api/auth/register
 * @param req.body = {email, name, password}
 * @response res.status(201) if successfull
 */
router.post('/register', registerValidator, registerController)

/**
 * @POST /api/auth/login
 * @param req.body = {email, password}
 * @response res.status(200) if successfull
 */

router.post('/login', loginValidator, loginController)

router.post('/logout', authenticate, logoutController )
/**
 * @GET /api/auth/me
 */
router.get('/me', authenticate ,getmeController)

router.post('/refresh', refreshController)


export default router;