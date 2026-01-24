const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config(); // Load environment variables

// 1. Define the Schema Inline 
// (We do this to avoid issues with Next.js path aliases like '@/models/userModel')
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'customer' }, // We will override this
    isVerified: { type: Boolean, default: false }
});

// Create Model
const User = mongoose.models.users || mongoose.model("users", userSchema);
console.log("mongo uri:", process.env.MONGO_URL);
async function seedAdmin() {
    try {
        // 2. Connect to Database
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URI is missing in your .env file");
        }
        console.log("🔌 Connecting to MongoDB...");
        
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ Connected to MongoDB");

   
        const adminEmail = "owner@tastebite.com";
        const adminPassword = "SecurePassword123!";  
        const existingUser = await User.findOne({ email: adminEmail });
        if (existingUser) {
            console.log("⚠️  Admin user already exists. Skipping creation.");
            return;
        }

        // 5. Hash the Password
        console.log("🔐 Hashing password...");
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(adminPassword, salt);

        // 6. Create the Admin User
        // MUST include firstName, lastName, phone because your schema requires them
        const newAdmin = new User({
            firstName: "Super",
            lastName: "Admin",
            email: adminEmail,
            phone: "0000000000",  
            password: hashedPassword,
            role: "super_admin",  
            isVerified: true
        });

        await newAdmin.save();
        console.log("🚀 Super Admin created successfully!");
        console.log(`👉 Email: ${adminEmail}`);
        console.log(`👉 Password: ${adminPassword}`);

    } catch (error) {
        console.error("❌ Error:", error.message);
    } finally {
        // 7. Close Connection
        await mongoose.connection.close();
        console.log("👋 Connection closed");
        process.exit();
    }
}

seedAdmin();