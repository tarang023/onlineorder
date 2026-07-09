import { NextResponse } from 'next/server';
import { connect } from "../../../../dbconfig/dbConfig";
import Order from "../../../../models/orderModel";

connect();

export async function GET(request) {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(100) // Limit to 100 to prevent overwhelming the frontend
      .select("orderId items status createdAt customer");

    const recentActivity = recentOrders.map((order) => {
      const orderTotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      return {
        id: order._id,
        type: "order",
        title: `Order #${order.orderId}`,
        description: `${order.customer?.name || "Customer"} placed an order for $${orderTotal.toFixed(2)}`,
        timestamp: order.createdAt,
        status: order.status === "delivered" ? "success" : "new"
      };
    });

    return NextResponse.json({ success: true, data: recentActivity });

  } catch (error) {
    console.error("Activity Log Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
