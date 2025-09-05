// File: lib/auth.js (New or existing file)

import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken' // Example: using iron-session or similar

export async function getUserFromSession() {
  // 1. Read the specific session cookie from the request.
  const sessionCookie = await cookies().get('token')?.value;

  if (!sessionCookie) {
    return null; // No user is logged in.
  }

  try {
    // 2. Decrypt the cookie to get the user data.
    // This logic depends on how you set up your sessions.
    const user =await jwt.verify(sessionCookie, process.env.TOKEN_SECRET);
    console.log("User from session:", user.id);
    return user.id;
  } catch (error) {
    console.error("Failed to decrypt session cookie:", error);
    return null;
  }
}