import {connect } from "../../../../dbconfig/dbConfig";
import User from "../../../../models/userModel";
import {NextRequest,NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from "../../../../helpers/mailer";
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
connect();

export async function POST(req: NextRequest) {
    try{
        const reqBody=await req.json()
        const {email,password}=reqBody

        console.log(reqBody)

        const user=await User.findOne({email})
        if(!user){
            return NextResponse.json({error:"User not found"}, {status:400})
        }
        console.log(user)
        const validPassword=await bcryptjs.compare(password,user.password)
        if(!validPassword){
            return NextResponse.json({error:"Invalid password check your credentials"}, {status:400})
        }

        const tokenData ={
            id :user._id,
           
            email: user.email
        }
        console.log(tokenData);
      const token =  await jwt.sign(tokenData,process.env.TOKEN_SECRET!,{expiresIn:'1d'})

          const response = NextResponse.json({
                message: "Login successful",
                success:true,
                
            });
        
            response.cookies.set("token",token,{httpOnly:true})
            return response
    }catch(error:any){
        return NextResponse.json({error:error.message}, {status:500})

    }
}