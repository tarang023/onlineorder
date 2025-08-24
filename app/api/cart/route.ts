// app/api/cart/route.js
import { NextRequest, NextResponse } from 'next/server';
import { connect } from '@/dbconfig/dbConfig';
import User from '@/models/userModel';
import { getDataFromToken } from '@/helpers/getDataFromToken';
import axios from 'axios';
await connect();

// GET: To fetch the user's current cart
export async function GET(request) {
  try {
    const userId = await getDataFromToken(request);
    // console.log("hello"+userId);
    const user = await User.findById(userId).select('cart');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
   

    return NextResponse.json({ cart: user.cart, success: true});
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: To add/update an item in the cart
export async function POST(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const itemToAdd = await request.json();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
     
    

    const itemIndex = user.cart.findIndex(
      (cartItem) => cartItem.productId === itemToAdd.id
    );

    if (itemIndex > -1) {
      // If item exists, update its quantity
      user.cart[itemIndex].quantity += 1;
    } else {
      // If item doesn't exist, add it to the cart
      user.cart.push({
        productId: itemToAdd.id,
        name: itemToAdd.name,
        price: itemToAdd.price,
        image: itemToAdd.image,
        quantity: 1,
      });
    }

    const updatedUser = await user.save();
    return NextResponse.json({ cart: updatedUser.cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}