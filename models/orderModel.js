const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  items: [
    {
      productId: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: String,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    label: String,
    address: String,
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  paymentMethod: {
    type: String,
    default: 'Cash on Delivery',
    
  },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;