import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  description: {
    type: String,
  },
  type: {
    type: String,
    enum: ["string", "number", "boolean", "object"],
    default: "string",
  }
}, { timestamps: true });

const SystemSetting = mongoose.models.SystemSetting || mongoose.model("SystemSetting", systemSettingSchema);
export default SystemSetting;
