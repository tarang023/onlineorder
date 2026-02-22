import {connect } from "../../../../dbconfig/dbConfig"
import Order from "@/models/orderModel";
import {NextRequest,NextResponse } from 'next/server';
 import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import User from "../../../../models/userModel";
import axios from "axios";
import { sendOrderToKitchen } from '@/lib/kitchenPlace';

connect();


export async function POST(req ) {
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
        const specialInstruction=reqBody.specialInstruction;
        estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + 30);
        // const restaurant=reqBody.restaurant;
        const pickupTime=reqBody.pickupTime;
        const orderType=reqBody.orderType;
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

    const timeline=[
      {
        status: "confirmed",
        timestamp: new Date(Date.now()),
        title: "Order Confirmed",
        description: "Your order has been received and confirmed",
      },
      {
        status: "preparing",
        timestamp: new Date(Date.now() + 60000),
        title: "Preparing Your Order",
        description: "Our kitchen is preparing your delicious meal",
        estimatedCompletion: new Date(Date.now() + 1200000),
      },
      {
        status: "ready",
        timestamp: new Date(Date.now()  ),
        title: "Ready for Pickup",
        description: "Your order is ready and waiting for delivery",
        estimatedCompletion: new Date(Date.now() + 125000),
      },
      {
        status: "out_for_delivery",
        timestamp: new Date(Date.now()  ),
        title: "Out for Delivery",
        description: "Your order is on its way to you",
        estimatedCompletion: new Date(Date.now() + 1300000),
      },
      {
        status: "delivered",
        timestamp: new Date(Date.now()  ),
        title: "Delivered",
        description: "Enjoy your meal!",
        estimatedCompletion:new Date(Date.now() + 140000),
      },
    ];
    const totalAmountnt = 500;
         const newOrder= new Order({
           orderId,
            status,
            orderTime,
            estimatedDelivery, 
            pickupTime,
            address,
            totalAmountnt,
            orderType,
            user, 
            customer,
            restaurant,
            specialInstruction,
            timeline: timeline,
            items: user.cart,
            paymentMethod
         });
         console.log("newOrder created",newOrder)
         const savedOrder=await newOrder.save();
        
        user.orderId=orderId;
        await user.save();

         await sendOrderToKitchen(newOrder,customerName);
         console.log("order send to kitchen")
        return NextResponse.json({message: "Order created not exist successfully", order: savedOrder}, {status: 201});
    
        
  

      
    }catch(error){
        return NextResponse.json({message: "Failed to create order", error: error.message}, {status: 500});
    }
}