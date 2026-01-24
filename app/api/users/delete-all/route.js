// app/api/users/delete-all/route.js

import { connect } from "@/dbconfig/dbConfig";
import  User from "@/models/userModel"; // Import the model you want to clear
import { NextResponse } from 'next/server';
import  Order from '@/models/orderModel'
import {HelpMessage} from '@/models/helpMessage'
await connect();

export async function DELETE(request) {
  try {
    // The .deleteMany({}) method with an empty object deletes all documents
    const result = await HelpMessage.deleteMany({});

    return NextResponse.json({
      message: `${result.deletedCount} kitchen orders were deleted successfully.`,
      success: true,
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// app/api/users/delete-all/route.js

// import { connect } from "@/dbconfig/dbConfig";
// // import  User from "@/models/userModel"; // Import the model you want to clear
// import { NextResponse } from 'next/server';
// import User from '@/models/userModel'
// await connect();

// export async function DELETE(request) {
//   try {
//     // The .deleteMany({}) method with an empty object deletes all documents
//     const result = await User.deleteMany({});

//     return NextResponse.json({
//       message: `${result.deletedCount} kitchen orders were deleted successfully.`,
//       success: true,
//     });

//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }