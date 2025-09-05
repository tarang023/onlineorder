import KitchenDisplayClient from './KitchenDisplayClient';
import axios from 'axios';
import {fetchKitchenOrders} from '@/lib/kitchenOrder';
import { connect } from '@/dbconfig/dbConfig'; // Example
import KitchenOrder from '@/models/kitchenOrderModel'; // Example
// This is now a Server Component

export const revalidate = 0;
async function getOrders() {
  await connect();
  
  // Get plain objects from the database
  const ordersFromDb = await KitchenOrder.find({}).lean();

  try {
    // This is the crucial test. It will attempt to serialize your data.
    // If ANY field is not valid for JSON, it will fail and jump to the catch block.
    const plainOrders = JSON.parse(JSON.stringify(ordersFromDb));
 
    return plainOrders;

  } catch (error) {
    console.error("========================================");
    console.error("!!! SERIALIZATION FAILED ON SERVER !!!");
    console.error("========================================");
    console.error("The error message is:", error.message);
    
    // This will help you inspect the problematic data structure in your terminal
    console.log("Data that could not be serialized:", JSON.stringify(ordersFromDb, null, 2));

    // Return an empty array to prevent the page from crashing while you debug
    return [];
  }
}
export default async function KitchenDisplaySystemPage() {
  // 1. Fetch data on the server before the page is rendered
  
  const initialOrders = await getOrders();

  // 2. Pass the fetched data as a prop to the client component
  return <KitchenDisplayClient initialOrders={initialOrders} />;
}