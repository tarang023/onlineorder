import nodemailer from "nodemailer";
import User from "../models/userModel";
import bcryptjs from 'bcryptjs'

export const sendEmail = async ({email,emailType,userId,otp})=>{
    try{

        //configure mail for usage has to add
       const hashedToken= await bcryptjs.hash(userId.toString(), 10)
    //    console.log("hashedToken",hashedToken);
        if(emailType==="VERIFY"){
           const updatedUser= await User.findByIdAndUpdate(userId,{$set : {verifyToken:hashedToken,verifyTokenExpiry:Date.now() + 3600000}}) // 1 hour expiry;
            //verification email
        }else if(emailType==="RESET"){
            await User.findByIdAndUpdate(userId,{$set:{forgotPasswordToken:hashedToken,forgotPasswordTokenExpiry:Date.now() + 3600000}}) // 1 hour expiry;
            //forgot password email
        }

        const nodemailerr = require("nodemailer");
        console.log("process.env.MAIL_HOST",process.env.MAIL_HOST);
        console.log("process.env.MAIL_PORT",process.env.MAIL_PORT);
        console.log("process.env.MAIL_USER",process.env.MAIL_USER);
        console.log("process.env.MAIL_PASS",process.env.MAIL_PASS);

          // Looking to send emails in production? Check out our Email API/SMTP product!
           // Looking to send emails in production? Check out our Email API/SMTP product!
            var transporter = nodemailerr.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
            });
                        const mailOptions = {
                from: process.env.MAIL_FROM,
                to: email,
                subject: emailType==='VERIFY' ? "Email Verification" : "FORGOT PASSWORD",
                html: `
                <div style="font-family: sans-serif; text-align: center; padding: 20px;">
                    <h2>Email Verification</h2>
                    <p>Thank you for signing up. Please use the following code to verify your email address:</p>
                    <p style="font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px; padding: 10px; background: #f0f0f0; border-radius: 5px;">
                        ${otp}
                    </p>
                    <p>This code is valid for 10 minutes.</p>
                </div>
            `
               
                // html:`<p>click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}"> </a> to ${emailType==='VERIFY' ? "verify your email" : "reset your password"} or copy paste link into browser. <br>
                // ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`

 
            };
          const mailResponse=await transporter.sendMail(mailOptions)
          return mailResponse
    }catch(err){
        throw new Error("Error sending email: " + err.message);
    
    }
}