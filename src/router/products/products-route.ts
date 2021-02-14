// importing
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IProduct, Product } from '../../model/products/products';

// router config
const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    try {
        const products: Array<IProduct> = await Product.find().limit(25);
        res.json({
            message: 'Products fetched successfully',
            products
        })
    } catch (err) {
        res.status(401).json({
            message: 'Unable to fetch products',
        })
    }
})

router.get('/:categoryId', async (req: Request, res: Response) => {
    try {
        const { categoryId } = req.params;

        // fetch products for selected category
        const products: Array<IProduct> = await Product.find({ productCategory: { $$elemMatch: { 'categoryId': categoryId } } });

        // send the reponse for user
        res.json({
            message: 'Products successfully fetched',
            products
        })
    } catch (err) {

        // handle error response
        res.status(401).json({
            message: "Unable to fetch products for the given category"
        })
    }
})

router.get('/product/:productId', async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const product = await Product.findOne({ _id: mongoose.Types.ObjectId(productId) });

        if (product) {
            res.json({
                message: 'Product fetched successfully',
                product
            })
        } else {
            res.status(401).json({
                message: 'Unable to fetch product',
            })
        }
    } catch (err) {
        res.status(401).json({
            message: 'Unable to fetch product',
        })
    }
})
export default router;