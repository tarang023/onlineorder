// File: app/api/getData/route.js (Refactored)

import { fetchCartItems } from '@/lib/cart'; // Adjust path as needed
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const items = await fetchCartItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}