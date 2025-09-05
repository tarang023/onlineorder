// File: lib/cart.js (Updated)

import { getUserFromSession } from './auth'; // Import the new function
import { connect } from '@/dbconfig/dbConfig'; // Example
import kitchenOrderModel  from '@/models/kitchenOrderModel'; // Example

connect()
export async function fetchKitchenOrders() {
  // This function now gets the user without needing a 'req' parameter.
  const userId = await getUserFromSession();
  const kitchenOrder = await kitchenOrderModel.find({}).lean();
  if (!userId) {
      console.log("No user session found.");
      return [];
    }
    console.log("kitchenOrder",kitchenOrder);
    
  // Your existing database logic
//   const db = await connect();
   // Manually convert each item's _id to a string.
 
const plainOrders = kitchenOrder.map(order => ({
    ...order,
    _id: order._id.toString(), // Convert ObjectId to a string
    timestamp: order.timestamp.toISOString(), // Convert Date to a string
    estimatedTime: order.estimatedTime.toISOString(),
    lastUpdated: order.lastUpdated.toISOString(),
    
    // The 'items' sub-documents are usually plain already, 
    // but if they had ObjectIds, you would convert them here too.
  }));
  return plainOrders;
}