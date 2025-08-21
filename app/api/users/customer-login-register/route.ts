import {connect } from "../../../../dbconfig/dbConfig";
import User from "../../../../models/userModel";
import {NextRequest,NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { sendEmail } from "../../../../helpers/mailer";

connect()

export async function POST(req: NextRequest) {
    try{
       const reqBody= await req.json()
       console.log("reqBody",reqBody);
       const {email,phone,password,firstName,lastName,rememberMe,acceptTerms}=reqBody
 
      const user = await User.findOne({email})
      if(user){
          return NextResponse.json({error:"User already exists"}, {status:400});

      }

      const salt=await bcryptjs.genSalt(10);
      const hashedPassword=await bcryptjs.hash(password,salt);
      const username=firstName+lastName;
     const newUser= new User({
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

      //send verification email
      await sendEmail({email,emailType:"VERIFY",userId:savedUser._id})
      return NextResponse.json({message:"User registered successfully"}, {status:201});


    }catch(err:any){
        return NextResponse.json({error:err.message}, {status:500})
    }
}

