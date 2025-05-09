// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";

export async function middleware(request: NextRequest) {
  console.log(`[Middleware] Attempting to execute for path: ${request.nextUrl.pathname}`);

  try {
    const session = await auth.api.getSession({
      headers: await headers() // you need to pass the headers object.
    });

    if (!session) {
      console.log("[Middleware] No session found using auth.api.getSession. Redirecting.");
      return NextResponse.redirect(new URL("/", request.url));
    }

    console.log('session', session);

    console.log("[Middleware] Session data (auth.api.getSession):", session);
    return NextResponse.next();
  } catch (error) {
    console.error("[Middleware] Error getting session (auth.api.getSession):", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
