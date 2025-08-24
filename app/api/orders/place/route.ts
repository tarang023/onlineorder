import {connect } from "../../../../dbconfig/dbConfig"
import Order from "../../../../models/orderModel";
import {NextRequest,NextResponse } from 'next/server';
 import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import User from "../../../../models/userModel";
connect();


export async function POST(req: NextRequest) {
    try{
         
   
        const customer="TARANG"
        const paymentMethod= "Credit Card ending in 4532";
        const status = "confirmed";
        const orderTime=Date.now();
        const estimatedDelivery = new Date(orderTime);
        estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + 30);
        // const restaurant=reqBody.restaurant;
        const  restaurant={
      name: "TasteBite Downtown",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street, Downtown, NY 10001",
    };
        
      const userId=await getDataFromToken(req);
      const user = await User.findById(userId);
      const order=await Order.findOne({ user: userId });
      if(!user){
         return NextResponse.json({message: "User not found"}, {status: 404});
      }
       const timeline = [
      {
        status: "confirmed",
        timestamp: new Date(Date.now() - 1800000),
        title: "Order Confirmed",
        description: "Your order has been received and confirmed",
      },]
      if(!order){
         const newOrder= new Order({
            status,
            orderTime,
            estimatedDelivery, 
            user, 
            restaurant,
            customer,
            timeline: timeline,
            items: user.cart,
            paymentMethod
        });
        const savedOrder=await newOrder.save();
        return NextResponse.json({message: "Order created not exist successfully", order: savedOrder}, {status: 201});
    }else{
        
        order.items=user.cart;
        await order.save();
        return NextResponse.json({message: "Order created exist successfully", order: order}, {status: 201});
      }

      
    }catch(error){
        return NextResponse.json({message: "Failed to create order", error: error.message}, {status: 500});
    }
}