import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbConfig";
import itemCategory from "@/models/itemCategories";
connect();
export async function POST(req) {
    const {id,name,icon}=await req.json();

   const newCategory = new itemCategory({
       id,
       name,
       icon
   });

   await newCategory.save();

   return NextResponse.json({message:"Category added successfully"}, {status:201});
}
 

 