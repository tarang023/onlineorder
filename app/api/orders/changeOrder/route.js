import {connect } from "../../../../dbconfig/dbConfig"
import Order from "../../../../models/orderModel";
import {NextRequest,NextResponse } from 'next/server';
 import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import User from "../../../../models/userModel";
import axios from "axios";
import { updateKitchen } from '@/lib/updateKitchenOrder';

connect();


export async function POST(req ) { 
    try{
        const { orderId, status } = await req.json();
        const user = await getDataFromToken(req);
        // Validate input
        if (!orderId || !status) {
            return NextResponse.json({ error: "Missing orderId or status" }, { status: 400 });
        }

        // Find the order
        const order = await Order.findOne({orderId:orderId});
        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Update the order status
        if(status=='in-progress'){
            order.status='preparing';
        }
        if(status=='ready'){
            order.status='ready'
        }
        if(status=='completed'){
            order.status='out_for_delivery';
        }
        // order.status = status;
        const customerName=user.firstName+" "+user.lastName;
        await order.save();

        // Send the updated order to the kitchen
  
        await updateKitchen(order,status);
        return NextResponse.json({ message: "Order updated successfully" }, { status: 200 });
    }catch(error){
        console.error("Error in POST /api/orders/changeOrder:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}