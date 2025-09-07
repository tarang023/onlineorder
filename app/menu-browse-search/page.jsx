import MenuBrowseSearch from './menuBrowseClient';
import { fetchCartItems } from '@/lib/cart'; 
import { connect } from '@/dbconfig/dbConfig'; 
import menuItems from '@/models/menuItemsModel'; 
import itemCategory  from '@/models/itemCategories'
export const revalidate = 0;
async function getCartData() {
   await connect();
   const ordersFromDb = await menuItems.find({}).lean();
   const categoriesFromDb = await itemCategory.find({}).lean();

   try {
     const plainItems = JSON.parse(JSON.stringify(ordersFromDb));
     const plainCategories = JSON.parse(JSON.stringify(categoriesFromDb));
     return { items: plainItems, categories: plainCategories };
   } catch (error) {
     console.error("========================================");
     console.error("!!! SERIALIZATION FAILED ON SERVER !!!");
     console.error("========================================");
     console.error("The error message is:", error.message); 
     console.log("Data that could not be serialized:", JSON.stringify(ordersFromDb, null, 2));
     return [];
   }
}

export default async function ShoppingCartCheckoutPage() {
  const initialMenuItems = await getCartData();
  console.log("initial menu items", initialMenuItems);

  return <MenuBrowseSearch menuItems={initialMenuItems.items} categories={initialMenuItems.categories} />;
}
 