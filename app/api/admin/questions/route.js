import { NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbConfig";
import  HelpMessage from "@/models/helpMessage"; // The new model from Step 1

connect();

export async function GET(request) {
  try {
    // Get all questions, newest first
    const questions = await HelpMessage.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}