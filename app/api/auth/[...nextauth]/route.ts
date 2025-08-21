// app/api/auth/[...nextauth]/route.js

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { connect } from "@/dbconfig/dbConfig"; // Import your database connection function
import User from "@/models/userModel"; // Import your User model

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connect(); // 1. Connect to your database

        // 2. Check if a user with this email already exists
        const existingUser = await User.findOne({ email: profile.email });

        if (existingUser) {
          // You might want to update the user's info here if needed
          console.log("User already exists:", existingUser);
        } else {
          // 3. If the user doesn't exist, create a new one
          const newUser = new User({
            email: profile.email,
            firstName: profile.given_name, // 'given_name' from Google profile
            lastName: profile.family_name, // 'family_name' from Google profile
            // You can add more fields like profile image from 'profile.picture'
            // Since this is an OAuth login, we don't have a password to save.
            // Your schema should be flexible enough to allow an empty password for OAuth users.
          });
          
          await newUser.save();
          console.log("New user created:", newUser);
        }
        
        return true; // 4. Return true to allow the sign-in to complete
      } catch (error) {
        console.error("Error during signIn callback:", error);
        return false; // Return false to prevent the sign-in
      }
    },
  },
});

export { handler as GET, handler as POST };