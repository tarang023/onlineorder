import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  orderId:{
    type:String,
    required:true
  },
  status:{
    type:String,
    enum:['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'],
    default:'preparing'
  },
  orderTime:{
    type:Date,
    required:true,
    default:Date.now()
  },
  estimatedDelivery: {
    type: Date,
    required: true,
    default: Date.now() + 20 * 60 * 1000 // 20 minutes from now
  },
  orderType: {
    type: String,
    enum: ['delivery', 'pickup'],
    default: 'delivery'
  },
  restaurant: {
 name: String,
 phone: String,
 address: String
   },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
     customer: {
      name: String,
      phone: Number,
      address: String
    },
  items: [
    {
      productId: { type: Number, required: true },
      name: { type: String, required: true },
      variant: { type: String },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      // image: { type: String },
      customizations: { type: [String], default: [] },
    },
  ],
  paymentMethod:{
    type:String,
    default:'Cash on Delivery'
  },
  timeline:[
    {
      status: {
        type: String,
        enum: ['confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'],
        default: 'confirmed'
      },
      timestamp: {
        type: Date,
        default: Date.now()
      },
      title: {
        type: String,
        default:"Order Confirmed"
      },
      description: {
        type: String,
        default:"Our kitchen is preparing your delicious meal"
      },
      estimatedCompletion: {
        type: Date,
        default: Date.now() + 20 * 60 * 1000 // 20 minutes from now
      }
    }
  ],
  driver: {
    name: { type: String, default:"Mike Rodriguez" },
    photo: { type: String, default: "https://randomuser.me/api/portraits/men/32.jpg" },
    phone: { type: String, default: "+1 (555) 456-7890" },
    vehicle: { type: String, default: "Honda Civic - ABC 123" },
    rating:{type:Number,default:5},
    location:{
      lat: {
        type: String,
        default: "40.7589"
      },
      lng: {
        type: String,
        default: "-73.9851"
      }
    }
  },
  deliveryInstructions: {
    type: String,
    default: "Leave at the front door"
  },
  canModify: {
    type: Boolean,
    default: true
  },
  canCancel: {
    type: Boolean,
    default: true
  }
  

  },{ timestamps: true }); // Adds createdAt and updatedAt timestamps

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;