 
import { Icon } from 'lucide-react';
import mongoose from 'mongoose';
const itemCategorySchema = new mongoose.Schema({
    id:{
        type: String, required: true,
        unique: true,
    },
    name: { 
        type: String, 
        required: true
     },
     icon:{
        type: String, 
        required: true
     }
});

 const itemCategory = mongoose.models.itemCategory || mongoose.model('itemCategory', itemCategorySchema);
    export default itemCategory;