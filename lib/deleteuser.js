
import { connect } from "@/dbconfig/dbConfig";
// import  User from "@/models/userModel"; // Import the model you want to clear
import { NextResponse } from 'next/server';
import User from '@/models/userModel'
await connect();


export async function deleteUser(email) {
    try{
        await User.deleteOne({email : email});
    }catch(error){
        console.log("error delete user",error)
    }
}