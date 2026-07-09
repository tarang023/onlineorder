import mongoose from 'mongoose';
 
const cartItemSchema = new mongoose.Schema({
  // Using productId to store the unique ID from your menu items
  productId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description:{
    type:String
  },
  category:{
    type:String
  },
  prepTime:{
    type:Number
  },
  isAvailable:{
    type:Boolean,
    default:true
  },
  rating:{
    type:Number
  },
  
  price: {
    type: Number,
    required: true,
  },
  image: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});



const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true,"please provide email"],
        unique: true
    },
    password:{
        type: String,
        required: [true,"please provide password"],
        
    },
    phone:{
        type:Number,
        required:[true,"phone number is required"]
    },
    firstName:{
        type:String,
        required:[true,"first name is required"]
    },
    lastName:{
        type:String,
        required:[true,"lastName is required"]
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["customer", "admin", "super_admin", "staff", "rider"], // Allowed values
        default: "customer"
        
    },
    orderId:{
      type:String,
    },
      cart: [cartItemSchema],
    forgotPasswordToken:String,
    forgotPasswordTokenExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date,
     
    verifyOtp: {
      type:String
    },
    verifyOtpExpiry: Date,
})

const User= mongoose.models.users ||  mongoose.model('users',userSchema);
export default User;