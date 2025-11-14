import * as jose from 'jose';

interface DecodedToken {
  role?: string;
  [key: string]: any;
}

export async function verifyFirebaseToken(token: string): Promise<DecodedToken | null> {
  try {
    // The issuer URL for Firebase tokens
    const issuer = 'https://securetoken.google.com/' + process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    // The JWKS (JSON Web Key Set) URI from where to fetch the public keys
    const jwksUri = 'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

    // Create a remote JWKS set to fetch the keys
    const JWKS = jose.createRemoteJWKSet(new URL(jwksUri));

    // Verify the JWT
    // This will automatically download the correct public key, cache it, and verify the token signature.
    // It also validates the 'iat', 'exp', 'aud', and 'iss' claims.
    const { payload } = await jose.jwtVerify(token, JWKS, {
      issuer: issuer,
      audience: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });

    // Return the decoded payload, which includes custom claims like 'role'
    return payload as DecodedToken;

  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
