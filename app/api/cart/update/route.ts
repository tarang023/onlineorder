// app/api/cart/update/route.js
import { NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbConfig';
import User from '@/models/userModel';
import { getDataFromToken } from '@/helpers/getDataFromToken';

await connect();

export async function POST(request) {
  try {
    const userId = await getDataFromToken(request);
    const { productId, quantity } = await request.json(); // quantity will be the new quantity

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const itemIndex = user.cart.findIndex(
      (cartItem) => cartItem.productId === productId
    );

    if (itemIndex > -1) {
      if (quantity > 0) {
        // Update item quantity
        user.cart[itemIndex].quantity = quantity;
      } else {
        // Remove item if quantity is 0 or less
        user.cart.splice(itemIndex, 1);
      }
      await user.save();
      return NextResponse.json({ cart: user.cart });
    }

    return NextResponse.json({ error: 'Item not in cart' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}