import { NextResponse } from 'next/server';
import { connect } from "../../../../../../dbconfig/dbConfig";
import Order from "../../../../../../models/orderModel";
import User from "../../../../../../models/userModel";
import { getDataFromToken } from "../../../../../../helpers/getDataFromToken";

connect();

export async function POST(request, { params }) {
  try {
    const { orderId } = params;
    const userId = await getDataFromToken(request);
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rider = await User.findById(userId);
    if (!rider || rider.role !== 'rider') {
      return NextResponse.json({ error: "Only riders can claim orders" }, { status: 403 });
    }

    // Atomic update to prevent race conditions
    // Only updates if the order is still in 'ready' status
    const claimedOrder = await Order.findOneAndUpdate(
      { 
        orderId: orderId, 
        status: 'ready' 
      },
      {
        $set: { 
          status: 'out_for_delivery',
          'driver.assignedRiderId': userId,
          'driver.name': `${rider.firstName} ${rider.lastName}`,
          'driver.phone': rider.phone,
          'timeline.$[elem].title': 'Order is on the way',
          'timeline.$[elem].description': `Your rider ${rider.firstName} has picked up the order`,
          'timeline.$[elem].timestamp': new Date()
        }
      },
      { 
        new: true,
        arrayFilters: [{ 'elem.status': 'out_for_delivery' }]
      }
    );

    if (!claimedOrder) {
      return NextResponse.json({ 
        error: "Order is no longer available or does not exist" 
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: true,
      message: "Order claimed successfully",
      data: claimedOrder
    });

  } catch (error) {
    console.error("Claim order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
