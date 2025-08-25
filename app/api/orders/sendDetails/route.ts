 import {connect } from "../../../../dbconfig/dbConfig";
 
 import {NextRequest,NextResponse } from 'next/server';
 import bcryptjs from 'bcryptjs';
 import jwt from 'jsonwebtoken';
 import { getDataFromToken } from "../../../../helpers/getDataFromToken";
import Order from "@/models/orderModel";
import User from "@/models/userModel"
 connect();
 
 export async function POST(req: NextRequest){
    try{
     //extract data from token
    //  const reqBody = await req.json();
    const userId=await getDataFromToken(req);
      const user = await User.findById(userId);

      if(!user){
        return NextResponse.json({message: "User not found"}, {status: 404});
      }
      // const orderId = reqBody.orderId;
      const orderId=user.orderId;
      const order=await Order.findOne({ orderId: orderId });
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