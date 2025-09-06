// File: lib/cart.js (Updated)

import { getUserFromSession } from './auth'; // Import the new function
import { connect } from '@/dbconfig/dbConfig'; // Example
import User  from '@/models/userModel'; // Example
import Order from '@/models/orderModel'; // Example
connect()
export async function fetchOrderHistory() {
  // This function now gets the user without needing a 'req' parameter.
  const userId = await getUserFromSession();
  if(!userId) {
    console.log("No user found in session");
    return [];
  }
  const orders = await Order.find({ user: userId }).lean();
  if (!orders) {
      console.log("No orders found for user:", userId);
      return [];
    }

     const plainItems = JSON.parse(JSON.stringify(orders));
    

    return plainItems;

}