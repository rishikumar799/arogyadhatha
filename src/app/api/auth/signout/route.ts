
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // To sign out, we instruct the browser to clear the session cookie.
  // We do this by setting the cookie with the same name but with an expiry date in the past.
  const options = {
    name: 'firebase-session-token',
    value: '', // Set value to empty
    maxAge: -1, // Expire immediately
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  };

  const response = NextResponse.json({ status: 'success' }, { status: 200 });
  // Set the cookie on the response
  response.cookies.set(options);

  return response;
}
