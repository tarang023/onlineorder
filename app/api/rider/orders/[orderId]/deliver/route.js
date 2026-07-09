import { NextResponse } from 'next/server';
import { connect } from "../../../../../../dbconfig/dbConfig";
import Order from "../../../../../../models/orderModel";
import { getDataFromToken } from "../../../../../../helpers/getDataFromToken";

connect();

export async function POST(request, { params }) {
  try {
    const { orderId } = params;
    const userId = await getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the rider actually claimed this order
    const order = await Order.findOne({ orderId: orderId });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.driver.assignedRiderId.toString() !== userId) {
      return NextResponse.json({ error: "You are not assigned to this order" }, { status: 403 });
    }

    if (order.status !== 'out_for_delivery') {
      return NextResponse.json({ error: "Order must be out for delivery to be marked as delivered" }, { status: 400 });
    }

    const deliveredOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { 
        $set: { 
          status: 'delivered',
          'timeline.$[elem].title': 'Order Delivered',
          'timeline.$[elem].description': 'Enjoy your meal!',
          'timeline.$[elem].timestamp': new Date()
        }
      },
      { 
        new: true,
        arrayFilters: [{ 'elem.status': 'delivered' }]
      }
    );
    
    return NextResponse.json({
      success: true,
      message: "Order marked as delivered",
      data: deliveredOrder
    });

  } catch (error) {
    console.error("Deliver order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
