import { connect } from "../../../../dbconfig/dbConfig";
import User from "../../../../models/userModel";
import { NextResponse } from 'next/server';
import jwt from "jsonwebtoken"; // Make sure you have 'jsonwebtoken' installed
import {deleteUser} from '@/lib/deleteuser'
connect();

export async function POST(req) {
    try {
        const { email, votp } = await req.json();

        // Find the user by email in the database
        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if the OTP is correct and not expired
        if (user.isVerified || (user.verifyOtp !== votp || user.verifyOtpExpiry < Date.now())) {
             if(user.isVerified) {
                // If user is already verified, let them know. They should log in normally.
                return NextResponse.json({ error: "Account already verified. Please log in." }, { status: 400 });
             }
             await deleteUser(email); // Delete the unverified user
            return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
        }

        // If OTP is correct, update the user's status
        user.isVerified = true;
        user.verifyOtp = undefined;
        user.verifyOtpExpiry = undefined;
        await user.save();
        console.log("otp verified successfully");
        // --- NEW: Login logic starts here ---
        // Create token data for the session
        const tokenData = {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        };

        // Create the token using your secret key
        const token = jwt.sign(tokenData, process.env.TOKEN_SECRET, { expiresIn: "1d" });

        const response = NextResponse.json({
            message: "Email verified successfully! Logging you in.",
            success: true,
        });

        // Set the token in the user's cookies to create a session
        response.cookies.set("token", token, {
            httpOnly: true,
        });

        return response;

    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
