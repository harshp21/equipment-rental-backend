// importing
import express, { Request, Response } from 'express';
import { Category, ICategory } from '../../model/categories/categories';

// route config
const router = express.Router();


router.get('/', async (req: Request, res: Response) => {
    try {

        // fetch all categories
        const categories: Array<ICategory> = await Category.find();

        // send response for the user
        res.json({
            message: 'Fetched all categories successfully',
            categories
        })
    } catch (err) {

        //handle error response
        res.status(401).json({
            message: 'Unable to fetch categories',
        })
    }
})

export default router