import CheckoutClient from './CheckoutClient';
import { fetchCartItems } from '@/lib/cart'; // Import the shared function

// The getCartData function is now much simpler and more direct.
async function getCartData() {
  // Directly call the logic, no network request needed!
  return fetchCartItems();
}

export default async function ShoppingCartCheckoutPage() {
  const initialCartItems = await getCartData();
  console.log("Initial Cart Items:", initialCartItems);
  return <CheckoutClient initialCartItems={initialCartItems} />;
}
 