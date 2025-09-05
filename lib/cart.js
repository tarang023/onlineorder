// File: lib/cart.js (Updated)

import { getUserFromSession } from './auth'; // Import the new function
import { connect } from '@/dbconfig/dbConfig'; // Example
import User  from '@/models/userModel'; // Example

connect()
export async function fetchCartItems() {
  // This function now gets the user without needing a 'req' parameter.
  const userId = await getUserFromSession();
  const user = await User.findOne({ _id: userId }).lean();
  if (!user) {
      console.log("No user session found.");
      return [];
    }
 
  const plainCartItems = user.cart.map(item => ({
    ...item,
    _id: item._id.toString(), // <-- CONVERT ObjectId to string
  }));

  return plainCartItems;

}