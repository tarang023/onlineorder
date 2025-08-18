import mongoose from 'mongoose';
import { unique } from 'next/dist/build/utils';

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true,"please provide username"],
        unique: true
    },
    email:{
        type: String,
        required: [true,"please provide email"],
        unique: true
    },
    password:{
        type: String,
        required: [true,"please provide password"],
        unique: true
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    isAdmin:{
        type: Boolean,
        default: false
        
    },
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date
})