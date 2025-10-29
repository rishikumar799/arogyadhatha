
import { NextResponse, type NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import admin from './lib/firebase-admin';

const PROTECTED_ROUTES = ['/patient/dashboard', '/doctor/dashboard', '/receptionist/dashboard', '/diagnostics/dashboard', '/superadmin/dashboard', '/superadmin/requests'];
const AUTH_ROUTE = '/auth/signin';

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = cookies().get('__session')?.value;

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    if (!sessionCookie && isProtectedRoute) {
        // If there's no session cookie and the user is trying to access a protected route, redirect to sign-in
        const url = request.nextUrl.clone();
        url.pathname = AUTH_ROUTE;
        return NextResponse.redirect(url);
    }

    if (sessionCookie) {
        try {
            // Verify the session cookie
            const decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
            const userRole = decodedToken.role || 'patient'; 

            if (isProtectedRoute) {
                // If the user is on a protected route, check if their role matches the route
                if (!pathname.startsWith(`/${userRole}`)) {
                    // If roles don't match, redirect to their correct dashboard
                    const url = request.nextUrl.clone();
                    url.pathname = `/${userRole}/dashboard`;
                    return NextResponse.redirect(url);
                }
            } else if (pathname === AUTH_ROUTE) {
                // If the user is authenticated and tries to access the sign-in page, redirect to their dashboard
                const url = request.nextUrl.clone();
                url.pathname = `/${userRole}/dashboard`;
                return NextResponse.redirect(url);
            }

        } catch (error) {
            // If the session cookie is invalid, redirect to sign-in and clear the cookie
            const url = request.nextUrl.clone();
            url.pathname = AUTH_ROUTE;
            const response = NextResponse.redirect(url);
            response.cookies.set('__session', '', { maxAge: -1 }); // Clear the invalid cookie
            return response;
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico)._)',
    ],
};
