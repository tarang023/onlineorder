import { NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbConfig";
import HelpMessage from "@/models/helpMessage";
import { jwtVerify } from "jose";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connect();

export async function GET(request) {
  try {
    // 1. Authenticate User
    const token = request.cookies.get("token")?.value;
    const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    const userEmail = payload.email; // <--- Use Email instead of ID

    // 2. Find messages that have this EMAIL
    // (This works with your CURRENT schema)
    const myMessages = await HelpMessage.find({ email: userEmail }).sort({ createdAt: -1 });
    console.log("My Messages:", myMessages);

    return NextResponse.json({ success: true, data: myMessages });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}