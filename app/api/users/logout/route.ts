import {connect } from "../../../../dbconfig/dbConfig";
import User from "../../../../models/userModel";
import {NextRequest,NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from "../../../../helpers/mailer";
import jwt from 'jsonwebtoken';

connect();

export async function GET(req: NextRequest) {
    try{
       const response= NextResponse.json({
            message:"logout successfully",
            success:true,
           
        })
        console.log("hrere");
        response.cookies.set("token","",{httpOnly:true,expires:new Date(0)})
        return response
    }catch(error:any){  
        return NextResponse.json({error:error.message}, {status:500})
    }
}