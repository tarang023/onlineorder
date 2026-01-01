import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
    const path = request.nextUrl.pathname;
    
    // 1. Get the token from cookies
    const token = request.cookies.get('token')?.value || '';

    // 2. Decode the Token to get the Role
    let userRole = null;
    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.TOKEN_SECRET);
            const { payload } = await jwtVerify(token, secret);
            userRole = payload.role; // 'admin', 'super_admin', or 'customer'
        } catch (error) {
            console.log("Token verification failed");
        }
    }

    // --- PATH DEFINITIONS ---

    // A. Auth Pages (Public, but logged-in users shouldn't see them)
    const isAuthPage = path === '/customer-login-register' || path === '/verify';

    // B. Admin Paths (Only Admins allowed)
    const isAdminPath = path.startsWith('/admin') || path === '/kitchen-display-system';

    // C. Customer Paths (Admins should NOT see these)
    const customerPaths = [
        '/menu-browse-search',
        '/shopping-cart-checkout',
        '/order-tracking-status',
        '/customer-account-history'
    ];
    const isCustomerPath = customerPaths.some((route) => path.startsWith(route));


    // --- REDIRECTION RULES ---

    // 1. Logged-in User trying to visit Login/Register Pages
    //    Redirect them to their respective home pages
    if (isAuthPage && userRole) {
        if (userRole === 'admin' || userRole === 'super_admin') {
            return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl));
        } else {
            return NextResponse.redirect(new URL('/menu-browse-search', request.nextUrl));
        }
    }

    // 2. PROTECT ADMIN ROUTES (Block Customers)
    if (isAdminPath) {
        if (!userRole) {
            return NextResponse.redirect(new URL('/customer-login-register', request.nextUrl));
        }
        if (userRole !== 'admin' && userRole !== 'super_admin') {
            // If a customer tries to go to Admin Dashboard, send them to Menu
            return NextResponse.redirect(new URL('/menu-browse-search', request.nextUrl));
        }
    }

    // 3. PROTECT CUSTOMER ROUTES (Block Admins) <--- NEW LOGIC HERE
    if (isCustomerPath) {
        if (!userRole) {
            return NextResponse.redirect(new URL('/customer-login-register', request.nextUrl));
        }
        if (userRole === 'admin' || userRole === 'super_admin') {
            // If an Admin tries to buy food, send them back to Dashboard
            return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl));
        }
    }

    return NextResponse.next();
}

// Ensure all these paths are included so Middleware actually runs on them
export const config = {
    matcher: [
        '/',
        '/customer-login-register',
        '/verify',
        '/menu-browse-search',
        '/shopping-cart-checkout',
        '/order-tracking-status',
        '/kitchen-display-system',
        '/customer-account-history',
        '/admin/:path*',
    ],
};