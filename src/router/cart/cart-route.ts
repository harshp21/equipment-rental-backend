// importing
import express, { Request, Response } from 'express';
import { Cart, ICart } from '../../model/cart/cart';
import mongoose from 'mongoose';
import { authenticate } from '../../service/authentication-service';

// router config
const router = express.Router();

router.post('/add', authenticate, async (req: Request, res: Response) => {
    try {

        const { product, userId } = req.body;

        const cart = await Cart.findOne({ userId });
        const totalAmount = product.pricing.productPrice;
        const today = new Date();
        const tommorrow = new Date().setDate(today.getDate() + 1);
        let cartDetails = {};
        if (cart) {
            cartDetails = await Cart.findByIdAndUpdate(
                { _id: mongoose.Types.ObjectId(cart._id) },
                {
                    $push: {
                        cartProducts: {
                            productId: product._id,
                            productName: product.productName,
                            quantity: 1,
                            pricing: product.pricing,
                            bookedFrom: today,
                            bookedTo: tommorrow,
                        }
                    }, $inc: {
                        totalCartAmount: totalAmount
                    }
                }, { new: true });
        } else {
            // add details to cart
            const cart = new Cart({
                cartProducts: [{
                    productId: product._id,
                    productName: product.productName,
                    pricing: product.pricing,
                    bookedFrom: today,
                    bookedTo: tommorrow,
                    quantity: 1,
                }],
                totalCartAmount: totalAmount,
                userId: userId,
            });

            cartDetails = await cart.save();
        }
        res.json({
            message: 'Product added to cart',
            cartDetails
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Unable to add products to cart',
        })
    }
})

router.post('/remove', authenticate, async (req: Request, res: Response) => {
    try {
        const { product, userId } = req.body;

        console.log(product);
        const cart = await Cart.findOne({ userId });
        let cartDetails = {};
        if (cart) {
            cartDetails = await Cart.findByIdAndUpdate({ _id: mongoose.Types.ObjectId(cart._id) }, { $pull: { cartProducts: { productId: product._id } }, $inc: { totalCartAmount: (-1 * product.pricing.productPrice) } }, { new: true });
        }
        res.json({
            message: 'Product removed to cart',
            cartDetails
        });
    } catch (err) {
        res.status(400).json({
            message: 'Unable to remove products to cart',
        })
    }
})

router.put('/update', authenticate, async (req: Request, res: Response) => {
    try {
        const { product, quantity, dateRange, userId } = req.body;

        const differenceInTime = new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime();
        const differenceInDays = differenceInTime / (1000 * 3600 * 24);

        const updatedCartProduct: ICart = await Cart.findOneAndUpdate(
            { userId, 'cartProducts.productId': product._id },
            {
                $set: {
                    'cartProducts.$.quantity': quantity,
                    'cartProducts.$.bookedFrom': dateRange.start,
                    'cartProducts.$.bookedTo': dateRange.end,
                    'cartProducts.$.pricing.productPrice': product.pricing.productPrice * quantity * differenceInDays,
                },
            }, { new: true });

        const updatedCart = await Cart.findOneAndUpdate(
            { _id: updatedCartProduct._id },
            {
                $set: {
                    totalCartAmount: updatedCartProduct.cartProducts.reduce((acc, cartProduct) => acc + cartProduct.pricing.productPrice, 0)
                }
            }, { new: true })

        if (updatedCart) {
            res.json({
                message: 'Cart Product Updated',
                updatedCart
            })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: 'Failed to update cart',
        })
    }
})

router.get('/', authenticate, async (req: Request, res: Response) => {
    try {
        const { userId } = req.body;
        const cart: ICart = await Cart.findOne({ userId });
        if (cart) {
            res.json({
                message: 'Cart details fetched successfully',
                cart
            })
        }
    } catch (err) {
        res.status(401).json({
            message: 'Unable to fetch cart details'
        })
    }
})

export default router;