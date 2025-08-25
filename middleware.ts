import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    // Define paths that are considered public (accessible without a token)
    const isPublicPath = path === '/customer-login-register' || path === '/';

    // Get the token from the user's cookies
    const token = request.cookies.get('token')?.value || '';

    // If the user is trying to access a public path and they have a token,
    // redirect them to a protected page (e.g., the menu)
    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/menu-browse-search', request.nextUrl));
    }

    // If the user is trying to access a protected path and they DON'T have a token,
    // redirect them to the login page
    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/customer-login-register', request.nextUrl));
    }

    // If none of the above, let the request continue
    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/',
        '/customer-login-register',
        '/menu-browse-search',
        '/shopping-cart-checkout',
        '/order-tracking-status',
        '/kitchen-display-system',
        
        // Add any other paths you want this middleware to run on
    ],
};