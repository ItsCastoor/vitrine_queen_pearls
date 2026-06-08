import { NextResponse, type NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { admins, rolePermissions } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import type { ModuleKey } from "@/lib/auth/permissions";

type Attempt = { count: number; first: number };
const attempts = new Map<string, Attempt>();
const WINDOW = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || now - entry.first > WINDOW) {
    attempts.set(ip, { count: 1, first: now });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429 },
    );
  }

  let username = "";
  let password = "";

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const body = await request.json().catch(() => ({}));
    username = String(body.username ?? "");
    password = String(body.password ?? "");
  } else {
    const form = await request.formData();
    username = String(form.get("username") ?? "");
    password = String(form.get("password") ?? "");
  }

  if (!username || !password) {
    return NextResponse.json(
      { error: "Identifiant et mot de passe requis." },
      { status: 400 },
    );
  }

  const [admin] = await db
    .select({
      id: admins.id,
      username: admins.username,
      passwordHash: admins.passwordHash,
      isEnabled: admins.isEnabled,
      roleId: admins.roleId,
    })
    .from(admins)
    .where(eq(admins.username, username))
    .limit(1);

  if (!admin || !(await verifyPassword(password, admin.passwordHash))) {
    return NextResponse.json(
      { error: "Identifiants invalides." },
      { status: 401 },
    );
  }

  // isEnabled: NULL (colonnes pas encore migrées) → autorisé ; false → bloqué
  if (admin.isEnabled === false) {
    return NextResponse.json(
      { error: "Ce compte est désactivé. Contactez un administrateur." },
      { status: 403 },
    );
  }

  // roleId null = compte legacy (avant migration) → on autorise avec permissions vides
  const permissions: ModuleKey[] = [];
  if (admin.roleId) {
    const perms = await db
      .select({ moduleKey: rolePermissions.moduleKey })
      .from(rolePermissions)
      .where(eq(rolePermissions.roleId, admin.roleId));
    permissions.push(...perms.map((p) => p.moduleKey as ModuleKey));
  }

  await createSession(admin.id, admin.username, admin.roleId, permissions);
  attempts.delete(ip);

  return NextResponse.json({ ok: true });
}
