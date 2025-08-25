import KitchenOrder from '@/models/kitchenOrderModel'; // Import the model
import {getDataFromToken} from '@/helpers/getDataFromToken'
export async function sendOrderToKitchen(order,customerName) {
  try {
    const timestamp=new Date();
    const deliveryMethod=order.orderType;
    const status="new";
    const station="grill";
    const items=order.items;

    const kitchenOrder = new KitchenOrder({
        customerName,
        timestamp,
        station,
        deliveryMethod,
        status,
        items
    });

    await kitchenOrder.save();


    } catch (error) {
    console.error("Error saving to kitchen database:", error);
    return { success: false, message: "Failed to save kitchen order." };
  }
}