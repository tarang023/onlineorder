import nodemailer from "nodemailer";
import User from "../models/userModel";
import bcryptjs from 'bcryptjs'

export const sendEmail = async ({email,emailType,userId}:any)=>{
    try{

        //configure mail for usage has to add
       const hashedToken= await bcryptjs.hash(userId.toString(), 10)
        if(emailType==="VERIFY"){
           const updatedUser= await User.findByIdAndUpdate(userId,{$set : {verifyToken:hashedToken,verifyTokenExpiry:Date.now() + 3600000}}) // 1 hour expiry;
            //verification email
        }else if(emailType==="RESET"){
            await User.findByIdAndUpdate(userId,{$set:{forgotPasswordToken:hashedToken,forgotPasswordTokenExpiry:Date.now() + 3600000}}) // 1 hour expiry;
            //forgot password email
        }

        const nodemailerr = require("nodemailer");

          // Looking to send emails in production? Check out our Email API/SMTP product!
           // Looking to send emails in production? Check out our Email API/SMTP product!
            var transporter = nodemailerr.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "115c2ccb225062",
                pass: "889ff8ffb8902a"
            }
            });
                        const mailOptions = {
                from: "tarangkathiriya33@gmail.com",
                to: email,
                subject: emailType==='VERIFY' ? "Email Verification" : "FORGOT PASSWORD",
               
                html:`<p>click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"> </a> to ${emailType==='VERIFY' ? "verify your email" : "reset your password"} or copy paste link into browser. <br>
                ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`

 
            };
          const mailResponse=await transporter.sendMail(mailOptions)
          return mailResponse
    }catch(err:any){
        throw new Error("Error sending email: " + err.message);
    
    }
}