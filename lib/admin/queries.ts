import "server-only";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { getResource } from "@/lib/admin/registry";
import { guestbookEntries, recruitmentApplications } from "@/lib/db/schema";

export type NavBadges = Record<string, number>;

export async function getNavBadges(): Promise<NavBadges> {
  const badges: NavBadges = {};
  try {
    const [recrutement] = await db
      .select({ c: sql<number>`count(*)` })
      .from(recruitmentApplications)
      .where(sql`${recruitmentApplications.status} = 'new'`);
    badges.recrutement = Number(recrutement?.c ?? 0);
  } catch {
    badges.recrutement = 0;
  }
  try {
    const [guestbook] = await db
      .select({ c: sql<number>`count(*)` })
      .from(guestbookEntries)
      .where(sql`${guestbookEntries.status} = 'pending'`);
    badges["livre-or"] = Number(guestbook?.c ?? 0);
  } catch {
    badges["livre-or"] = 0;
  }
  return badges;
}

type Row = Record<string, unknown>;

export async function listRows(resourceKey: string): Promise<Row[]> {
  const resource = getResource(resourceKey);
  if (!resource) return [];
  try {
    const rows = await db
      .select()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from(resource.table as any)
      .orderBy(sql`id desc`);
    return rows as Row[];
  } catch {
    return [];
  }
}

export async function getRow(
  resourceKey: string,
  id: number,
): Promise<Row | null> {
  const resource = getResource(resourceKey);
  if (!resource) return null;
  try {
    const rows = await db
      .select()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from(resource.table as any)
      .where(sql`id = ${id}`)
      .limit(1);
    return (rows[0] as Row) ?? null;
  } catch {
    return null;
  }
}

export async function countRows(resourceKey: string): Promise<number> {
  const resource = getResource(resourceKey);
  if (!resource) return 0;
  try {
    const rows = await db
      .select({ c: sql<number>`count(*)` })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from(resource.table as any);
    return Number(rows[0]?.c ?? 0);
  } catch {
    return 0;
  }
}
