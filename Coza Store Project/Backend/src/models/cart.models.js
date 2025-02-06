import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    products: [
        {
            productId: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    total : {
        type: Number,
        default: 0
    },
    updated: {
        type: Date,
        default: Date.now()
    }
},
{
    timestamps: true
});


export const Cart = mongoose.model('Cart', cartSchema);