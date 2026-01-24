import { NextResponse } from "next/server";
import { connect } from "../../../../dbconfig/dbConfig"; // Adjust dots to match your folder structure
import HelpMessage from "../../../../models/helpMessage"; // Your specific model

connect();

export async function POST(request) {
  try {
    const reqBody = await request.json();
    const { messageId, replyText } = reqBody;

    // 1. Validation
    if (!messageId || !replyText) {
      return NextResponse.json({ error: "Message ID and Reply Text are required" }, { status: 400 });
    }

    // 2. Find the message by its unique _id
    const helpMsg = await HelpMessage.findById(messageId);

    
    if (!helpMsg) {
        return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    
    // 3. Update the fields
    // NOTE: This requires your Schema to have 'adminReply', 'repliedAt', and 'status'
    helpMsg.adminReply = replyText;
    helpMsg.repliedAt = new Date();
    helpMsg.status = 'replied';
    
    
    // 4. Save changes
    await helpMsg.save();

    return NextResponse.json({ 
        success: true, 
        message: "Reply sent successfully",
        data: helpMsg 
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}