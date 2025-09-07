

// app/api/users/delete-all/route.js

import { connect } from "@/dbconfig/dbConfig";
import  User from "@/models/userModel"; // Import the model you want to clear
import { NextResponse } from 'next/server';
 
import { getDataFromToken } from "@/helpers/getDataFromToken";
await connect();

export async function DELETE(request) {
  try {
    // The .deleteMany({}) method with an empty object deletes all documents
    const userId=getDataFromToken(request);
    console.log("User ID:", userId);
    if(!userId){
      return NextResponse.json({message: "Unauthorized"}, {status: 401});
    }
    const user = await User.findById(userId);
    if(!user){
      return NextResponse.json({message: "User not found"}, {status: 404});
    }
    user.cart=[];
    await user.save();
    // const result = await Order.deleteMany({user:userId});
    //
   

    return NextResponse.json({
      message:`user cart cleared successfully . and order placed successfully`,
      success: true,
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
 