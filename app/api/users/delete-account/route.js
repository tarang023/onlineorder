
import { connect } from "@/dbconfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import  User from "@/models/userModel"; // Import the model you want to clear
import { get } from "mongoose";
import { NextResponse } from 'next/server';
 
await connect();

export async function DELETE(request) {
  try {
    const userId=getDataFromToken(request);
    if(!userId){
        return NextResponse.json({error:"Unauthorized"}, {status:401})
    }
    const user=await User.findOne({_id:userId})
    if(!user){
        return NextResponse.json({error:"User not found"}, {status:400})
    }
    await User.deleteOne({_id:userId})
    
    const response= NextResponse.json({
            message:"deleted successfully",
            success:true,
            status:200
           
        })
        response.cookies.set("token","",{httpOnly:true,expires:new Date(0)})
        return response;
    

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}