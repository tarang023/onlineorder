 import {connect } from "@/dbconfig/dbConfig";
 
 import {NextRequest,NextResponse } from 'next/server';
  
 import { getDataFromToken } from "@/helpers/getDataFromToken";
import Order from "@/models/orderModel";
import User from "@/models/userModel"
import KitchenOrder from "@/models/kitchenOrderModel";
 connect();
 
 export async function POST(req ){
    try{
   
    const userId=await getDataFromToken(req);
      const user = await User.findById(userId);

      if(!user){
        return NextResponse.json({message: "User not found"}, {status: 404});
      }
      // const orderId = reqBody.orderId;
      const orderId=user.orderId;
      const order=await KitchenOrder.find({});
      if(!order){
             return NextResponse.json({message: "Order not found"}, {status: 404});
        }
         order.items=user.cart;
    return NextResponse.json({
             message:"User found",
             data:order
         });
        }catch(error){
            return NextResponse.json({message: "can not send details",error: error.message }, { status: 500 });
        }
    }