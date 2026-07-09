import { NextResponse } from 'next/server';
import { connect } from "../../../../dbconfig/dbConfig";
import Review from "../../../../models/reviewModel";

connect();

export async function GET(request) {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    
    return NextResponse.json({
      success: true,
      data: reviews
    });

  } catch (error) {
    console.error("Fetch Reviews Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
