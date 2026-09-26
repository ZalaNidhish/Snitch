import express from 'express';
export const app = express();
import authRouter from './routes/auth.routes.js';
import productRouter from './routes/product.routes.js';
import cookieParser from 'cookie-parser'

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/product', productRouter);

app.get('/', (req, res)=>{
    res.send('Snitch Server Running ... ');
})