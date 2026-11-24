
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const user = session.user as { role?: string; status?: string };
    const role = user.role || "customer";
    const status = user.status || "ACTIVE";

    // Block or redirect users with suspended or blocked accounts
    if (status === "BLOCKED" || status === "SUSPENDED" || status === "DEACTIVATED" || status === "INACTIVE") {
      return NextResponse.redirect(new URL("/unauthorized?reason=account-restricted", request.url));
    }

    // Rewrite/redirect legacy banking-staff URL to canonical bankStaff
    if (pathname.startsWith("/dashboard/banking-staff")) {
      const canonicalUrl = new URL(pathname.replace("/dashboard/banking-staff", "/dashboard/bankStaff"), request.url);
      return NextResponse.redirect(canonicalUrl);
    }

    // Role-based dashboard authorization:
    // 1. Admin Portal: accessible strictly by admin
    if (pathname.startsWith("/dashboard/admin")) {
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // 2. Staff Portal: accessible by banking-staff and admin
    if (pathname.startsWith("/dashboard/bankStaff")) {
      if (role !== "banking-staff" && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    // 3. Customer Portal: accessible by customer and admin
    if (pathname.startsWith("/dashboard/customer")) {
      if (role !== "customer" && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Proxy auth error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/requests/:id*"],
};
