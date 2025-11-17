import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLES = {
  superadmin: { dashboard: "/superadmin/dashboard", prefix: "/superadmin" },
  doctor: { dashboard: "/doctor/dashboard", prefix: "/doctor" },
  receptionist: { dashboard: "/receptionist/dashboard", prefix: "/receptionist" },
  patient: { dashboard: "/patients/dashboard", prefix: "/patients" },
  diagnostic: { dashboard: "/diagnostics/dashboard", prefix: "/diagnostics" },
};

const PUBLIC_PATHS = ["/", "/auth/signin", "/auth/signup"];

const isPublic = (path: string) => {
  const normalizedPath = path.endsWith('/') && path.length > 1 ? path.slice(0, -1) : path;
  return PUBLIC_PATHS.includes(normalizedPath);
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/") || pathname.includes('.')) {
    return NextResponse.next();
  }

  const token = request.cookies.get("firebase-session-token")?.value;
  const role = request.cookies.get("role")?.value;
  const isPublicPath = isPublic(pathname);

  // NOT LOGGED IN
  if (!token || !role) {
    if (isPublicPath) {
      return NextResponse.next();
    }

    // 🔥 FIX: Remove the `next` parameter to prevent redirect conflicts.
    // The frontend will now solely handle the redirect based on the API response.
    const url = new URL("/auth/signin", request.url);
    return NextResponse.redirect(url);
  }

  // LOGGED IN
  const roleConfig = ROLES[role as keyof typeof ROLES];

  if (!roleConfig) {
    const res = NextResponse.redirect(new URL("/auth/signin", request.url));
    res.cookies.delete("firebase-session-token");
    res.cookies.delete("role");
    res.cookies.delete("uid");
    return res;
  }

  if (isPublicPath) {
    return NextResponse.next();
  }

  if (!pathname.startsWith(roleConfig.prefix)) {
    return NextResponse.redirect(new URL(roleConfig.dashboard, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
