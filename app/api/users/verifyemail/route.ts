import { NextRequest, NextResponse } from 'next/server';
import { connect } from "../../../../dbconfig/dbConfig";
import User from "../../../../models/userModel";


connect()

export async function POST(req: NextRequest) {
    try{
        const reqBody=await req.json()
        const {token}=reqBody

        console.log(token)
       const user= await User.findOne({verifyToken:token,verifyTokenExpiry:{$gt:Date.now()}})
       if(!user){
        return NextResponse.json({error:"User not found"}, {status:404})
       }
       console.log(user);
       user.isVerified = true;
       user.verifyToken = undefined;
       user.verifyTokenExpiry = undefined;
       await user.save();
       return NextResponse.json({message:"Email verified successfully",success:true}, {status:200})
    }catch(err:any){
        return NextResponse.json({error:err.message}, {status:500})

    }
}