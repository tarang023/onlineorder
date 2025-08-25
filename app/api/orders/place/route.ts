import {connect } from "../../../../dbconfig/dbConfig"
import Order from "../../../../models/orderModel";
import {NextRequest,NextResponse } from 'next/server';
 import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import User from "../../../../models/userModel";
import axios from "axios";
import { sendOrderToKitchen } from '@/lib/kitchenPlace';
connect();


export async function POST(req: NextRequest) {
    try{
      const userId=await getDataFromToken(req);
      const user = await User.findById(userId);
      const reqBody=await req.json();
      if(!user){
         return NextResponse.json({message: "User not found"}, {status: 404});
      }
      const orderId=reqBody.orderId;
       const customerName=user.firstName + " " + user.lastName;
        const customerPhone=user.phone;
        const paymentMethod= reqBody.paymentMethod || "Cash on Delivery";
        const status = "confirmed";
        const orderTime=Date.now();
        const estimatedDelivery = new Date(orderTime);
        estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + 30);
        // const restaurant=reqBody.restaurant;
        const address=reqBody.selectedAddress;
        const  restaurant={
      name: "TasteBite Downtown",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, Downtown, NY 10001",
    };
    const customer={
      name: customerName,
      phone: customerPhone,
      address: address
    };

      const order=await Order.findOne({ user: userId });
      
       const timeline = [
      {
        status: "confirmed",
        timestamp: new Date(Date.now() - 1800000),
        title: "Order Confirmed",
        description: "Your order has been received and confirmed",
      },]
  
         const newOrder= new Order({
          orderId,
            status,
            orderTime,
            estimatedDelivery, 
            user, 
            customer,
            restaurant,
            timeline: timeline,
            items: user.cart,
            paymentMethod
         });
        const savedOrder=await newOrder.save();
        
        user.orderId=orderId;
        await user.save();
    
         await sendOrderToKitchen(newOrder,customerName);
        return NextResponse.json({message: "Order created not exist successfully", order: savedOrder}, {status: 201});
    
        
  

      
    }catch(error){
        return NextResponse.json({message: "Failed to create order", error: error.message}, {status: 500});
    }
}