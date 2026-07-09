import { NextResponse } from 'next/server';
import { connect } from "../../../../../dbconfig/dbConfig";
import Order from "../../../../../models/orderModel";
import { getDataFromToken } from "../../../../../helpers/getDataFromToken";

connect();

export async function GET(request, { params }) {
  try {
    const { orderId } = params;
    const userId = await getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await Order.findOne({ orderId: orderId });
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Ensure the rider is the one assigned to this order
    if (order.driver?.assignedRiderId?.toString() !== userId) {
      return NextResponse.json({ error: "You are not assigned to this order" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: order
    });

  } catch (error) {
    console.error("Fetch rider order details error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
