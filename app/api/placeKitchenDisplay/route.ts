import {connect } from "../../../dbconfig/dbConfig"
import {NextRequest,NextResponse } from 'next/server';
 import { getDataFromToken } from "../../../helpers/getDataFromToken";
import User from "../../../models/userModel";
import Order from "../../../models/orderModel";
import KitchenOrder from "../../../models/kitchenOrderModel";
import { get } from "mongoose";

connect();

export async function POST(req: NextRequest) {
    try{
    const userId=await getDataFromToken(req);
    const user = await User.findById(userId);

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const order=await Order.find({   });

    if (!order) {
        return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    const customerName=user.firstName + " " + user.lastName;
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

    return NextResponse.json(kitchenOrder, { status: 201 });
}catch(error){
    console.error("Error creating kitchen order:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
}
}