import { NextResponse } from 'next/server';
import { connect } from "../../../../../dbconfig/dbConfig";
import Order from "../../../../../models/orderModel";
import { getDataFromToken } from "../../../../../helpers/getDataFromToken";

connect();

export async function GET(request) {
  try {
    const userId = await getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch orders that are ready for pickup
    const availableOrders = await Order.find({ status: 'ready' }).sort({ orderTime: 1 });
    
    return NextResponse.json({
      success: true,
      data: availableOrders
    });

  } catch (error) {
    console.error("Fetch available orders error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
