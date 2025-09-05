import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbConfig";
// import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import menuItems from "@/models/menuItemsModel";
connect();
export async function POST(req) {
    const {id,name,description,price,originalPrice,image,category,dietary,spiceLevel,prepTime,allergens,isAvailable,isPopular,discount,rating,reviewCount}=await req.json();

   const newItem = new menuItems({
       id,
       name,
       description,
       price,
       originalPrice,
       image,
       category,
       dietary,
       spiceLevel,
       prepTime,
       allergens,
       isAvailable,
       isPopular,
       discount,
       rating,
       reviewCount
   });

   await newItem.save();

   return NextResponse.json({message:"Item added successfully"}, {status:201});
}