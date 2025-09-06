import {connect } from "../../../../dbconfig/dbConfig";
import User from "../../../../models/userModel";
import {NextRequest,NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
 
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { getDataFromToken } from "@/helpers/getDataFromToken";
connect();

export async function POST(req ) {
    try{
        const reqBody=await req.json();
        const userId=getDataFromToken(req);
        if(!userId){
            return NextResponse.json({error:"Unauthorized"}, {status:401})
        }
        console.log(reqBody)
        const oldPassword=reqBody.oldPassword;
        const newPassword=reqBody.newPassword;
        const user=await User.findOne({_id:userId})
        if(!user){
            return NextResponse.json({error:"User not found"}, {status:400})
        }
        console.log(user)
        const validPassword=await bcryptjs.compare(oldPassword,user.password)
        if(!validPassword){
            return NextResponse.json({error:"Invalid password check your credentials"}, {status:400})
        }
        if(!user.isVerified){
            return NextResponse.json({error:"User is not verified"}, {status:400})
        }
              const salt=await bcryptjs.genSalt(10);
              const hashedPassword=await bcryptjs.hash(newPassword,salt);
              user.password=hashedPassword;
              await user.save();
              return NextResponse.json({message:"Password changed successfully"}, {status:200});
    }catch(error){
        return NextResponse.json({error:error.message}, {status:500})

    }
}