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
    
     return [];
   }
}

export default async function ShoppingCartCheckoutPage() {
  const customer = await getCustomer();
  

  return <App customers={customer} />;
}
 