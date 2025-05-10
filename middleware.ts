import { NextRequest, NextResponse } from "next/server";
import { headers as getNextHeaders } from "next/headers"; // Renamed import
import { auth } from "./src/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow requests to API routes (especially auth), Next.js internals, and public files to pass through
  if (
    pathname.startsWith("/api/") || // Let all API routes pass
    pathname.startsWith("/_next/") || // Next.js internal paths
    pathname.includes(".") // Heuristic for static files like favicon.ico, image.png etc.
  ) {
    return NextResponse.next();
  }

  console.log(`[Middleware] Checking session for protected path: ${pathname}`);

  const nextIncomingHeaders = await getNextHeaders(); // Correctly await headers
  const standardHeaders = new Headers(); // Create a standard Headers object
  nextIncomingHeaders.forEach((value, key) => {
    standardHeaders.append(key, value); // Populate standard Headers
  });

  const session = await auth.api.getSession({
    headers: standardHeaders, // Pass the standard Headers object
  });

  if (!session) {
    console.log(
      `[Middleware] No session for path ${pathname}. Redirecting to /.`
    );
    // Avoid redirecting if already on the public root page (assuming it's the login/landing page)
    if (pathname === "/") {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log(`[Middleware] Session found for ${pathname}. Proceeding.`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for those that should always be public
     * or are handled by Next.js internally.
     * The logic inside the middleware function provides finer-grained control.
     */
    // Adjusted matcher to be less aggressive and rely more on the checks within the middleware.
    "/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|images/|api/).*)",
  ],
};
