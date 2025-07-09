import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

interface TokenPayload {
  userId: string;
  email: string;
  isPremium: boolean;
  hasCompletedOnboarding: boolean;
  usageCounts?: {
    uploads: number;
  };
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  if (!token) {
    if (!url.pathname.startsWith("/login") && !url.pathname.startsWith("/onboarding")) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    const {
      isPremium,
      usageCounts,
    } = payload as unknown as TokenPayload;

 

    if (
      !isPremium &&
      usageCounts?.uploads !== undefined &&
      usageCounts.uploads >= 5 &&
      !url.pathname.startsWith("/upgrade") &&
      !url.pathname.startsWith("/dashboard/locked")
    ) {
      url.pathname = "/dashboard/locked";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/protected/:path*"],
};
