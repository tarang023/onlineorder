import { NextResponse } from 'next/server';
import { connect } from "../../../dbconfig/dbConfig";
import Review from "../../../models/reviewModel";
import User from "../../../models/userModel";
import { getDataFromToken } from "../../../helpers/getDataFromToken";

connect();

export async function POST(request) {
  try {
    const data = await request.json();
    const { rating, comment } = data;

    if (!rating || !comment) {
      return NextResponse.json({ error: "Please provide a rating and comment." }, { status: 400 });
    }

    // Get user from token
    const userId = await getDataFromToken(request);
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User not found or unauthorized." }, { status: 401 });
    }

    const customerName = `${user.firstName} ${user.lastName}`.trim();

    const newReview = new Review({
      customerName,
      rating: Number(rating),
      comment,
      status: "published" // Default status
    });

    await newReview.save();
    
    return NextResponse.json({
      success: true,
      message: "Review submitted successfully",
      data: newReview
    });

  } catch (error) {
    console.error("Submit Review Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
