import mongoose from "mongoose";

const helpMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const HelpMessage = mongoose.models.HelpMessage || mongoose.model('HelpMessage', helpMessageSchema);

export default HelpMessage;