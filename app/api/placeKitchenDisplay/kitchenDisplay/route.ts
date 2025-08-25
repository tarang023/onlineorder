import {connect } from "../../../../dbconfig/dbConfig"
import {NextRequest,NextResponse } from 'next/server';
 import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import User from "../../../../models/userModel";
import Order from "../../../../models/orderModel";
import KitchenOrder from "../../../../models/kitchenOrderModel";
import { get } from "mongoose";

connect();

export async function POST(req: NextRequest) {
    try{
    const userId=await getDataFromToken(req);
    const user = await User.findById(userId);

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const order=await KitchenOrder.find({});
    // console.log(order);

    if (!order) {
        return NextResponse.json({ message: "Order not found" }, { status: 500 });
    }
    return NextResponse.json({ message: "Kitchen data sent successfully", order }, { status: 200 });
}catch(error){
    return NextResponse.json({ message: "Internal Server Error sending kitchen data" }, { status: 500 });
}
}
