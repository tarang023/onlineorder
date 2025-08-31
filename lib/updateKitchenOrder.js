import KitchenOrder from '@/models/kitchenOrderModel'; // Import the model
import {getDataFromToken} from '@/helpers/getDataFromToken'
export async function updateKitchen(order,status) {
  try {
    console.log(order.orderId);
    const kitchenOrder = await KitchenOrder.findOne({id: order.orderId });
    if (!kitchenOrder) {
      console.error("Kitchen order not found");
      return { success: false, message: "Kitchen order not found." };
    }

    // Update the kitchen order fields
    
    kitchenOrder.status = status;
    kitchenOrder.items = order.items;

    await kitchenOrder.save();
    return { success: true, message: "Kitchen order updated successfully." };
  } catch (error) {
    console.error("Error updating order in the kitchen", error);
    return { success: false, message: "Failed to update kitchen order." };
  }
}