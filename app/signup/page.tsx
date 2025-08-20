'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function SignupPage() {
const router=useRouter();
    const [user,setUser]=useState({
        email:"",
        password:"",
        username:""
    });
    const [buttonDisabled,setButtonDisabled]=useState(false);
    const [loading,setLoading]=useState(false);
const onSignup=async()=>{
    try{
        setLoading(true);
       const response=await axios.post("/api/users/signup",user);
       console.log("signup successful",response.data);
       router.push("/login");




    }catch(error:any){
        toast.error(error.message);
        throw new Error(error+" signup failed");
}

useEffect(()=>{
    if(user.email.length > 0 && user.password.length > 0 && user.username.length > 0){
        setButtonDisabled(false);
    }else{
        setButtonDisabled(true);
    }
},[user])

    return (
        <>
        <div className='text-black bg-black'>
            <h1>Signup fsdfdsfs</h1>
        </div>
        </>
    );
}
}

