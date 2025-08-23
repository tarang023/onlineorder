// app/api/orders/place/route.js
import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbConfig';
import User from '@/models/userModel';
import Order from '@/models/orderModel';
import { getDataFromToken } from '@/helpers/getDataFromToken';

await connect();

export async function POST(request) {
  try {
    const userId = await getDataFromToken(request);
    const reqBody = await request.json();
    // const { paymentMethod, shippingAddress } = reqBody;

    // 1. Get the user and their cart
    const user = await User.findById(userId);
    if (!user || user.cart.length === 0) {
      return NextResponse.json({ error: 'User not found or cart is empty' }, { status: 400 });
    }

    // 2. Calculate the final total on the server to be secure
    const totalAmount = user.cart.reduce((total, item) => total + item.price * item.quantity, 0);

    // 3. Create a new order
    const newOrder = new Order({
      user: userId,
      items: user.cart,
      totalAmount,
      paymentMethod,
      shippingAddress,
    });
    const savedOrder = await newOrder.save();

    // 4. Clear the user's cart
    user.cart = [];
    await user.save();

    return NextResponse.json({
      message: 'Order placed successfully!',
      success: true,
      orderId: savedOrder._id,
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}