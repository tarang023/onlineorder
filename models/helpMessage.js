// models/helpMessageModel.js
import mongoose from "mongoose";

const helpMessageSchema = new mongoose.Schema({
  // ... your existing fields ...
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
 
  adminReply: { type: String, default: null },
  repliedAt: { type: Date },
  status: { 
    type: String, 
    enum: ['open', 'replied'], 
    default: 'open' 
  },
}, { timestamps: true });

const HelpMessage = mongoose.models.HelpMessage || mongoose.model('HelpMessage', helpMessageSchema);
export default HelpMessage;