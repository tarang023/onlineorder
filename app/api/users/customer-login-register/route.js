import {connect } from "../../../../dbconfig/dbConfig";
import User from "../../../../models/userModel";
import {NextRequest,NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from "../../../../helpers/mailer";

connect()

export async function POST(req ) {
    try{
       const reqBody= await req.json()
       console.log("reqBody",reqBody);
       const {email,phone,password,firstName,lastName,rememberMe,acceptTerms}=reqBody
 
      const user = await User.findOne({email})
      if(user){
          return NextResponse.json({error:"User already exists"}, {status:400});

      }
            //send verification email
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const salt=await bcryptjs.genSalt(10);
      const hashedPassword=await bcryptjs.hash(password,salt);
      const username=firstName+lastName;
     const newUser= new User({
      verifyOtp: otp,
      verifyOtpExpiry: Date.now() + 15 * 60 * 1000, // 15 minutes from now
          email,
          phone,
          password:hashedPassword,
          firstName,
          lastName,
        rememberMe,
        acceptTerms
      });
      const savedUser= await newUser.save();
      console.log("newUser",newUser);
      console.log("savedUser",savedUser);
      await sendEmail({email,emailType:"VERIFY",userId:savedUser._id,otp})


      return NextResponse.json({message:"User registered successfully"}, {status:201});


    }catch(err){
        return NextResponse.json({error:err.message}, {status:500})
    }
}

