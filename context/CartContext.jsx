"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';

import axios from 'axios';
import Cookies from "js-cookie"; 

const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}
let cartItems=[];
export const CartProvider = ({ children }) => {
  // const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

 
 const addToCart = async (item) => {
 
const response=await axios.post("/api/cart",item);
console.log(response);
console.log(item);
};
 const updateCartItem = async (productId, quantity) => {
    const response=await axios.post("/api/cart/update", { productId, quantity });
    console.log(response);
    
    // Optimistically update UI
//     if (quantity > 0) {
//       setCartItems(prev => prev.map(item => item.productId === productId ? { ...item, quantity } : item));
//     } else {
//       setCartItems(prev => prev.filter(item => item.productId !== productId));
//     }
//  await fetch('/api/cart/update', [{
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       credentials: 'include', 
//       body: JSON.stringify({ productId, quantity }),
//     }] );
  };
  const value = {
    cartItems,
    addToCart,
     updateCartItem,
    isLoading, // You can provide the loading state to your components
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};