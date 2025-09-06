import AccountHistory from './AccountHistory';
import { fetchOrderHistory } from '@/lib/orderHistory'; // Import the shared function
import { fetchUserProfile } from '@/lib/userInfo'; // Import the shared function
// The getCartData function is now much simpler and more direct.
async function getOrderHistory() {
  // Directly call the logic, no network request needed!
  return  fetchOrderHistory();
}
async function getUserProfile() {
  return fetchUserProfile();
}

export default async function ShoppingCartCheckoutPage() {
  const initialOrderItems = await getOrderHistory();
  const profile = await getUserProfile();
  console.log("Initial Order Items:", initialOrderItems);
  return <AccountHistory initialOrderItems={initialOrderItems} profile={profile} />;
}
 