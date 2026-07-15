import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/auth"];
const GUEST_ONLY_PATHS = ["/auth"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Use a non-HttpOnly flag cookie to detect session
  const hasSession = request.cookies.has("session_flag");

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isGuestOnly = GUEST_ONLY_PATHS.some((p) => pathname.startsWith(p));

  if (isGuestOnly && hasSession) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isPublic && !hasSession) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json|icons).*)"],
};
