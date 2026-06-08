import "server-only";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ModuleKey } from "./permissions";

export interface AdminSession {
  adminId?: number;
  username?: string;
  roleId?: number;
  /** Liste des moduleKey accessibles pour cet admin. */
  permissions?: ModuleKey[];
}

function sessionOptions(): SessionOptions {
  const password = process.env.SESSION_SECRET;
  if (!password || password.length < 32) {
    throw new Error(
      "SESSION_SECRET manquant ou trop court (32 caractères minimum). Voir .env.example.",
    );
  }
  return {
    password,
    cookieName: "qp_admin_session",
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: "/",
    },
  };
}

export async function getSession(): Promise<AdminSession> {
  const cookieStore = await cookies();
  return getIronSession<AdminSession>(cookieStore, sessionOptions());
}

export async function createSession(
  adminId: number,
  username: string,
  roleId: number | null,
  permissions: ModuleKey[],
): Promise<void> {
  const cookieStore = await cookies();
  const session = await getIronSession<AdminSession>(cookieStore, sessionOptions());
  session.adminId = adminId;
  session.username = username;
  session.roleId = roleId ?? undefined;
  session.permissions = permissions;
  await session.save();
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const session = await getIronSession<AdminSession>(cookieStore, sessionOptions());
  session.destroy();
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return typeof session.adminId === "number";
}

/** Redirige vers /admin/login si non authentifié. À utiliser dans les pages/actions admin. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getSession();
  if (typeof session.adminId !== "number") {
    redirect("/admin/login");
  }
  return session;
}
