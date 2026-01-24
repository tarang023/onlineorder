import {connect } from "../../../../dbconfig/dbConfig";
import User from "../../../../models/userModel";
import {NextRequest,NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from "../../../../helpers/mailer";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
connect();

export async function POST(req ) {
    try{
        const reqBody=await req.json()
        const {email,password}=reqBody
 

        const user=await User.findOne({email})
        if(!user){
            return NextResponse.json({error:"User not found"}, {status:400})
        }
         
        const validPassword=await bcryptjs.compare(password,user.password)
        if(!validPassword){
            return NextResponse.json({error:"Invalid password check your credentials"}, {status:400})
        }
        if(!user.isVerified){
            console.log("user is not verified");
            return NextResponse.json({error:"User is not verified"}, {status:400})
        }
        const tokenData ={
            id :user._id,
            email: user.email,
            role: user.role || "customer"  // Default to 'customer' if role is undefined
        }
        console.log(tokenData);
      const token =  await jwt.sign(tokenData,process.env.TOKEN_SECRET,{expiresIn:'1d'})

          const response = NextResponse.json({
                message: "Login successful",
                success:true,
                
            });
        
            response.cookies.set("token",token,{httpOnly:true})
            return response
    }catch(error){
        return NextResponse.json({error:error.message}, {status:500})

    }
}