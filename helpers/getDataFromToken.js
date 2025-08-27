import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken'


export const getDataFromToken = (req)=>{
    try{    
        console.log("inside get token");
        const token= req.cookies.get("token")?.value || "";
          if (!token) {
            throw new Error("Authentication token not found in cookies.");
        }
        
        const secret = process.env.TOKEN_SECRET;

      
        if (!secret) {
            throw new Error("TOKEN_SECRET is not defined in .env.local file.");
        }
        const decodedToken=jwt.verify(token,process.env.TOKEN_SECRET)
        console.log("outside get token");
        console.log("Decoded Token:", decodedToken);
       return decodedToken.id

    }catch(error){
        throw new Error(error.message)
    
    }
}