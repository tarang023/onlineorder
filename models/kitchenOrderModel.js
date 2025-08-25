import { complex } from "framer-motion";
import mongoose from "mongoose";
import { idText } from "typescript";
const kitchenOrderSchema = new mongoose.Schema({
        customerName:{
            type: String,
            required: true
        },
        timestamp:{
            type: Date,
            default: new Date(Date.now() - 12 * 60000)
        },
        deliveryMethod: {
            type: String,
            // enum: ['dine-in', 'delivery'],
            default: 'delivery'
        },
        estimatedTime: {
            type: Date,
            default: new Date(Date.now() + 30 * 60000)
        },
        status: {
            type: String,
            enum: ['new', 'in-progress', 'ready', 'completed'],
            default: 'new'
        },
        priority:{
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        station:{
            type: String,
            default:'grill'
        },
        address:{
            type: String,
            
        },
        lastUpdated: {
            type: Date,
            default: Date.now()
        },
        items:[
            {
                productId: {
                    type: String,
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                price:{
                    type: Number,
                    required: true
                },
                specialInstructions: {
                    type: String,
                    required: false
                },
                completed: {
                    type: Boolean,
                    default: false
                }
            }
        ]
      });

    const KitchenOrder = mongoose.models.KitchenOrder || mongoose.model('KitchenOrder', kitchenOrderSchema);
    export default KitchenOrder;