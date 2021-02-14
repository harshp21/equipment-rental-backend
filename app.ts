// importing
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';

// routes
import userRoute from './src/router/user/user-route';
import categoriesRoute from "./src/router/categories/categories-route";
import productRoute from "./src/router/products/products-route";
import cartRoute from "./src/router/cart/cart-route";
import paymentRoute from "./src/router/payment/payment-route";
import orderRoute from './src/router/order/order-route';

// app config
const app = express();
dotenv.config();
const port = process.env.PORT || 5000;

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
    origin: process.env.REQUEST_ORIGIN
}))

// router
app.use('/user', userRoute);
app.use('/categories', categoriesRoute);
app.use('/products', productRoute);
app.use('/cart', cartRoute);
app.use('/payment', paymentRoute);
app.use('/orders', orderRoute);

// db config
const connectionUrl = process.env.MONGODB_CONNECTION_URL;
mongoose.connect(connectionUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Successfully connected to mongodb")).catch(err => console.log("mongo error", err));

// app listen
app.listen(port, () => console.log(`listening on port : ${port}`));
