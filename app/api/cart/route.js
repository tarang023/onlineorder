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
     console.log('DEBUG: User ID from token is:', userId, '| Type:', typeof userId);

        // --- ADD THIS LINE TO DEBUG THE USER MODEL ---
        console.log('DEBUG: User model is:', User);
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
export async function POST(request) {  
  try {
    const userId = await getDataFromToken(request);
    const itemToAdd = await request.json();

    // Attempt 1: Try to increment if the item already exists in the cart
    let updatedUser = await User.findOneAndUpdate(
      { _id: userId, "cart.productId": itemToAdd.id },
      { $inc: { "cart.$.quantity": 1 } },
      { new: true }
    );

    // If it didn't exist, try to push it
    if (!updatedUser) {
      const newItem = {
        productId: itemToAdd.id,
        name: itemToAdd.name,
        price: itemToAdd.price,
        image: itemToAdd.image,
        quantity: 1,
        description: itemToAdd.description,
        category: itemToAdd.category,
        prepTime: itemToAdd.prepTime,
        isAvailable: itemToAdd.isAvailable,
        rating: itemToAdd.rating,
      };

      // Attempt 2: Push only if the item is still NOT in the cart
      updatedUser = await User.findOneAndUpdate(
        { _id: userId, "cart.productId": { $ne: itemToAdd.id } },
        { $push: { cart: newItem } },
        { new: true }
      );

      // Attempt 3: If push failed, it means another concurrent request JUST pushed it, so we can now increment it safely
      if (!updatedUser) {
        updatedUser = await User.findOneAndUpdate(
          { _id: userId, "cart.productId": itemToAdd.id },
          { $inc: { "cart.$.quantity": 1 } },
          { new: true }
        );
      }
    }

    if (!updatedUser) {
      return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
    }
    return NextResponse.json({ cart: updatedUser.cart }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}