import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbConfig";
import HelpMessage from '@/models/helpMessage'
import { getDataFromToken } from "@/helpers/getDataFromToken";
connect();

export async function POST(req) { 
    const userId=getDataFromToken(req)
    if(!userId){
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
   const {name,email,message}=await req.json()
    if(!name || !email || !message){
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    try {
        const newHelpMessage = new HelpMessage({ name,email,message });
        await newHelpMessage.save();
        return NextResponse.json({ message: "Help message added successfully" , status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error adding help message", error ,status: 500 });
    }
}

 