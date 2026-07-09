import { NextResponse } from 'next/server';
import { connect } from "../../../../dbconfig/dbConfig";
import SystemSetting from "../../../../models/systemSettingModel";

connect();

export async function GET(request) {
  try {
    const settings = await SystemSetting.find();
    
    return NextResponse.json({
      success: true,
      data: settings
    });

  } catch (error) {
    console.error("Fetch Settings Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const data = await request.json();
    
    // Iterate and update each setting
    for (const key of Object.keys(data)) {
      await SystemSetting.findOneAndUpdate(
        { key },
        { value: data[key].value, type: data[key].type, description: data[key].description },
        { upsert: true, new: true }
      );
    }

    const updatedSettings = await SystemSetting.find();
    
    return NextResponse.json({
      success: true,
      message: "Settings updated successfully",
      data: updatedSettings
    });

  } catch (error) {
    console.error("Update Settings Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
