import mongoose from "mongoose";
const menuItemSchema = new mongoose.Schema({
    id:{
        type:Number,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    originalPrice:{
        type:Number,
        
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    dietary:{
        type:[String],
        required:true
    },
    spiceLevel:{
        type:Number,
        default:0
    },
    prepTime:{
        type:Number,
    },
    allergens:{
        type:[String],
        required:true
    },
    isAvailable:{
        type:Boolean,
        default:true
    },

    isPopular:{
        type:Boolean,
        default:false
    },
    discount:{
        type:String,    
        default:""
    },
    rating:{
        type:Number,
    },
    reviewCount:{
        type:Number,
        default:0
    }
})

 const menuItems = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
    export default menuItems;