import express from 'express';
export const app = express();
import authRouter from './routes/auth.routes.js';
import productRouter from './routes/product.routes.js';
import cartRouter from './routes/cart.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'

app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter)

app.get('/', (req, res)=>{
    res.send('Snitch Server Running ... ');
})