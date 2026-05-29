import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import type { AdminSession } from "@/lib/auth/session";

const COOKIE_NAME = "qp_admin_session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /admin/login reste accessible
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const password = process.env.SESSION_SECRET ?? "";
  const res = NextResponse.next();

  const cookieStore = {
    get: (name: string) => {
      const c = request.cookies.get(name);
      return c ? { name: c.name, value: c.value } : undefined;
    },
    set: (...args: unknown[]) => {
      // @ts-expect-error — délégation directe vers ResponseCookies.set (signatures compatibles)
      res.cookies.set(...args);
    },
  };

  try {
    const session = await getIronSession<AdminSession>(cookieStore, {
      password,
      cookieName: COOKIE_NAME,
    });

    if (typeof session.adminId !== "number") {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  } catch {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
