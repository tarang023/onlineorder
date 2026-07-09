import { NextResponse } from 'next/server';
import { connect } from "../../../../dbconfig/dbConfig";
import Order from "../../../../models/orderModel";

connect();

export async function GET(request) {
  try {
    const topSellingItems = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          variant: { $first: "$items.variant" },
          category: { $first: "$items.category" }, // May not exist on order items, but included if present
          sales: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { sales: -1 } } // No limit, return all
    ]);

    const formattedData = topSellingItems.map((item, index) => ({
      id: index + 1,
      productId: item._id,
      name: item.name + (item.variant ? ` (${item.variant})` : ""),
      category: item.category || "Main",
      sales: item.sales,
      revenue: item.revenue,
      growth: 0 
    }));

    return NextResponse.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Top Selling Items Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
