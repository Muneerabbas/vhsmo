import { NextRequest, NextResponse } from "next/server";
import { hasLaunched } from "./lib/launch";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const launched = hasLaunched();

  // Checkout is locked
  if (pathname.startsWith("/checkout") && !launched) {
    return NextResponse.redirect(new URL("/launch", req.url));
  }

  // Launch page disappears after launch
  if (pathname.startsWith("/launch") && launched) {
    return NextResponse.redirect(new URL("/checkout", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/launch", "/checkout"],
};
