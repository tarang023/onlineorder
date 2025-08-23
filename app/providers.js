// app/providers.js
"use client";
import { CartProvider } from '@/context/CartContext'; 
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }) {
  return <SessionProvider><CartProvider>{children}</CartProvider></SessionProvider>;
}