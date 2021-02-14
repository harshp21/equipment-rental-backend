import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({

    cartProducts: [{
        productId: String,
        productName: String,
        quantity: Number,
        pricing: {
            productPrice: Number,
            currency: String,
        },
        bookedFrom: Date,
        bookedTo: Date,
    }],
    totalCartAmount: Number,
    userId: String,
    status: {
        type: String,
        default: 'active'
    },
})

interface ICart extends mongoose.Document {
    cartProducts: Array<any>,
    totalCartAmount: number,
    userId: string,
    isActive: boolean,
}

const Cart = mongoose.model<ICart>('Cart', cartSchema);

export { Cart, ICart };