import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({

    orderId: String,
    user: {
        userId: String,
        username: String,
    },
    shipping: {
        customer: String,
        address: String,
        city: String,
        state: String,
        country: String,
    },
    payment: {
        method: String,
        paymentId: String,
    },
    products: [{
        productId: String,
        quantity: Number,
        productName: String,
        bookedFrom: Date,
        bookedTo: Date,
    }],
    totalAmount: Number,
    orderTimestamp: Date,
    bookedFrom: Date,
    bookedTo: Date,
    status: String,
    bookedOn: Date,
})

interface IOrder extends mongoose.Document {
    orderId: String,
    user: Object,
    shipping: Object,
    payment: Object,
    products: Array<Object>,
    totalAmount: number,
    orderTimestamp: Date,
    bookedFrom: Date,
    bookedTo: Date,
    status: string,
    bookedOn: Date
};

const Order = mongoose.model<IOrder>('Order', orderSchema);

export { Order, IOrder };