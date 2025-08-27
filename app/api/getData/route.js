 import {connect } from "../../../dbconfig/dbConfig";
 import User from "../../../models/userModel";
 import {NextRequest,NextResponse } from 'next/server';
 import bcryptjs from 'bcryptjs';
 import { sendEmail } from "../../../helpers/mailer";
 import jwt from 'jsonwebtoken';
 import { getDataFromToken } from "../../../helpers/getDataFromToken";
 connect();
 
 export async function POST(req){
     //extract data from token
     const userId=await getDataFromToken(req)
     const user=await User.findOne({_id: userId }).select("-password");
    if(!user){
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
     return NextResponse.json({
         message:"User found",
         data:user.cart
     });
 
 }