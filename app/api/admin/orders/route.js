import { NextResponse } from 'next/server';
import { connect } from "../../../../dbconfig/dbConfig";
import Order from "../../../../models/orderModel";

connect();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 50;
    const page = parseInt(searchParams.get('page')) || 1;
    const status = searchParams.get('status');

    const query = {};
    if (status && status !== 'all') {
      if (status === 'live') {
        query.status = { $ne: 'delivered' };
      } else {
        query.status = status;
      }
    }

    const skip = (page - 1) * limit;

    const ordersData = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments(query);

    const orders = ordersData.map((order) => {
      const orderTotal = order.totalAmount || order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      
      return {
        _id: order._id,
        orderId: order.orderId,
        customerName: order.customer?.name || "Customer",
        customerPhone: order.customer?.phone || "N/A",
        customerAddress: order.customer?.address || "N/A",
        status: order.status,
        timestamp: order.createdAt,
        total: orderTotal,
        items: order.items,
        paymentMethod: order.paymentMethod,
        orderType: order.orderType
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        orders,
        pagination: {
          total: totalOrders,
          page,
          pages: Math.ceil(totalOrders / limit)
        }
      }
    });

  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
