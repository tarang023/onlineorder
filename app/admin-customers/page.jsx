import App from './adminCustomerClient.jsx'
import { connect } from '@/dbconfig/dbConfig'; 
import user from '@/models/userModel.js';
async function getCustomer() {
   await connect();
 const usersFromDb = await user.find({ }).lean();
   try {
     const plainUsers = JSON.parse(JSON.stringify(usersFromDb));
     return plainUsers
   } catch (error) {
     console.error("========================================");
     console.error("!!! SERIALIZATION FAILED ON SERVER !!!");
     console.error("========================================");
     console.error("The error message is:", error.message); 
     console.log("Data that could not be serialized:", JSON.stringify(usersFromDb, null, 2));
     return [];
   }
}

export default async function ShoppingCartCheckoutPage() {
  const customer = await getCustomer();
  

  return <App customers={customer} />;
}
 