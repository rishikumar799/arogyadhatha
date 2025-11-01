import { NextResponse } from 'next/server';

export async function POST() {
  // The sign-out logic is to tell the browser to delete the session cookie.
  // We do this by setting the cookie again but with an expiration date in the past.
  const response = NextResponse.json({ status: 'success', message: 'Signed out successfully' });

  // It is crucial that the options here (especially `secure` and `sameSite`)
  // exactly match the options used when the cookie was created in the session API.
  response.cookies.set('__session', '', {
    httpOnly: true,
    secure: true,           // Must be true to match session creation
    sameSite: 'none',       // Must be 'none' to match session creation
    path: '/',
    expires: new Date(0), // A date in the past tells the browser to expire the cookie
  });

  return response;
}
