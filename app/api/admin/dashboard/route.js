import { NextResponse } from 'next/server';
import { connect } from "../../../../dbconfig/dbConfig";
import Order from "../../../../models/orderModel";

connect();

export async function GET(request) {
  try {
    // 1. Calculate Summary Stats
    // Since 'totalAmount' is missing, we calculate it: sum(item.price * item.quantity)
    const summaryStats = await Order.aggregate([
      {
        $addFields: {
          computedTotal: {
            $sum: {
              $map: {
                input: "$items",
                as: "item",
                in: { $multiply: ["$$item.price", "$$item.quantity"] }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$computedTotal" },
          totalOrders: { $count: {} },
          averageOrderValue: { $avg: "$computedTotal" }
        }
      }
    ]);

    // 2. Sales Trend (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesTrend = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $addFields: {
          computedTotal: {
            $sum: {
              $map: {
                input: "$items",
                as: "item",
                in: { $multiply: ["$$item.price", "$$item.quantity"] }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          sales: { $sum: "$computedTotal" }
        }
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", sales: 1, _id: 0 } }
    ]);

    // 3. Top Selling Items
    const topSellingItems = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          // Variant is optional, but good to show if it exists
          variant: { $first: "$items.variant" }, 
          sales: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 5 }
    ]);

    // 4. Order Status Distribution
    const orderStatusDistribution = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          value: { $count: {} }
        }
      },
      { $project: { status: "$_id", value: 1, _id: 0 } }
    ]);

    // 5. Recent Activity (Latest 5 Orders)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("orderId items status createdAt customer");

    const recentActivity = recentOrders.map((order) => {
      // Calculate total for this specific order manually for display
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

    // 6. Construct Final Data
    const dashboardData = {
      summary: {
        totalSales: summaryStats[0]?.totalSales || 0,
        totalOrders: summaryStats[0]?.totalOrders || 0,
        averageOrderValue: Math.round(summaryStats[0]?.averageOrderValue || 0),
        customerSatisfaction: 4.8, // Hardcoded (User reviews not in schema)
      },
      salesTrend,
      topSellingItems: topSellingItems.map((item, index) => ({
        id: index + 1,
        name: item.name + (item.variant ? ` (${item.variant})` : ""),
        category: "Main", // Category not in schema, defaulted
        sales: item.sales,
        revenue: item.revenue,
        growth: 0 
      })),
      orderStatusDistribution,
      // Location data requires a 'branch' field which is missing, returning empty to prevent errors
      locationPerformance: [], 
      recentActivity
    };

    return NextResponse.json({ success: true, data: dashboardData });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}