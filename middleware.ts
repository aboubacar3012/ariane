import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "./src/lib/auth";

export async function middleware(request: NextRequest) {
  console.log(
    `[Middleware] Attempting to execute for path: ${request.nextUrl.pathname}`
  );
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    console.log(
      "[Middleware] No session found using auth.api.getSession. Redirecting."
    );
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log(
    "[Middleware] Session found. Proceeding to the next middleware or route handler."
  );
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - "/"
     */
    "/((?!$).*)",
  ],
};
