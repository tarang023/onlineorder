import { NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbConfig"; // Update path
import User from "../../../../models/userModel";         // Update path
import bcryptjs from "bcryptjs";
import { jwtVerify } from "jose"; // Use JOSE for edge compatibility if needed, or normal JWT

connect();

export async function POST(request) {
  try {
    // 1. Security Check: Is the requester a Super Admin?
    const token = request.cookies.get("token")?.value;
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify token (using standard verify for backend API routes is fine)
    // Note: If using 'jose' in middleware, standard 'jsonwebtoken' is fine here 
    // BUT ensure your TOKEN_SECRET matches.
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    if (decoded.role !== "super_admin") {
        return NextResponse.json({ error: "Access Denied: Only Super Admins can create admins." }, { status: 403 });
    }

    // 2. Create the User
    const reqBody = await request.json();
    const { firstName, lastName, email, phone, password } = reqBody;

    // Check existing
    const userExists = await User.findOne({ email });
    if (userExists) {
        return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }

    // Hash Password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newAdmin = new User({
        firstName,
        lastName,
        email,
        phone,
        password: hashedPassword,
        role: "admin", // <--- Force role to Admin
        isVerified: true
    });

    await newAdmin.save();

    return NextResponse.json({ success: true, message: "Admin created successfully" });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}