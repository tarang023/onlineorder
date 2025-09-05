import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
connect();

export async function POST(req) {
  //extract data from token
  const userId = await getDataFromToken(req);
  const user = await User.findOne({ _id: userId }).select("-password");
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  return NextResponse.json({
    message: "User found",
    data: user.cart,
  });
}
