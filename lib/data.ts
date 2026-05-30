import "server-only";
import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  posts,
  events,
  staff,
  galleryCategories,
  galleryItems,
  outfits,
  partners,
  faqEntries,
  hallOfFame,
  guestbookEntries,
} from "@/lib/db/schema";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export const getPublishedPosts = () =>
  safe(
    () =>
      db
        .select()
        .from(posts)
        .where(eq(posts.isDraft, false))
        .orderBy(desc(posts.publishedAt)),
    [],
  );

export const getPostBySlug = (slug: string) =>
  safe(
    async () => {
      const [row] = await db
        .select()
        .from(posts)
        .where(and(eq(posts.slug, slug), eq(posts.isDraft, false)))
        .limit(1);
      return row ?? null;
    },
    null,
  );

export const getEvents = (status?: "upcoming" | "past") =>
  safe(
    () =>
      status
        ? db
            .select()
            .from(events)
            .where(eq(events.status, status))
            .orderBy(desc(events.startsAt))
        : db.select().from(events).orderBy(desc(events.startsAt)),
    [],
  );

export const getHighlightEvents = () =>
  safe(
    () =>
      db
        .select()
        .from(events)
        .where(eq(events.status, "upcoming"))
        .orderBy(asc(events.startsAt))
        .limit(3),
    [],
  );

export const getHomeGalleryImages = (limit = 3) =>
  safe(
    () =>
      db
        .select()
        .from(galleryItems)
        .where(
          and(
            eq(galleryItems.type, "photo"),
            eq(galleryItems.showOnHome, true),
          ),
        )
        .orderBy(asc(galleryItems.sortOrder), desc(galleryItems.createdAt))
        .limit(limit),
    [],
  );

export const getEventBySlug = (slug: string) =>
  safe(
    async () => {
      const [row] = await db
        .select()
        .from(events)
        .where(eq(events.slug, slug))
        .limit(1);
      return row ?? null;
    },
    null,
  );

export const getStaff = () =>
  safe(
    () =>
      db
        .select()
        .from(staff)
        .where(eq(staff.isActive, true))
        .orderBy(asc(staff.sortOrder)),
    [],
  );

export const getGalleryCategories = () =>
  safe(
    () => db.select().from(galleryCategories).orderBy(asc(galleryCategories.sortOrder)),
    [],
  );

export const getGalleryCategoryBySlug = (slug: string) =>
  safe(
    async () => {
      const [row] = await db
        .select()
        .from(galleryCategories)
        .where(eq(galleryCategories.slug, slug))
        .limit(1);
      return row ?? null;
    },
    null,
  );

export const getGalleryItems = (categoryId: number) =>
  safe(
    () =>
      db
        .select()
        .from(galleryItems)
        .where(eq(galleryItems.categoryId, categoryId))
        .orderBy(asc(galleryItems.sortOrder)),
    [],
  );

export const getUncategorizedGalleryItems = () =>
  safe(
    () =>
      db
        .select()
        .from(galleryItems)
        .where(isNull(galleryItems.categoryId))
        .orderBy(asc(galleryItems.sortOrder)),
    [],
  );

export const getOutfits = () =>
  safe(() => db.select().from(outfits).orderBy(asc(outfits.sortOrder)), []);

export const getPartners = () =>
  safe(() => db.select().from(partners).orderBy(asc(partners.sortOrder)), []);

export const getFaq = () =>
  safe(() => db.select().from(faqEntries).orderBy(asc(faqEntries.sortOrder)), []);

export const getHallOfFame = () =>
  safe(() => db.select().from(hallOfFame).orderBy(asc(hallOfFame.sortOrder)), []);

export const getPublishedGuestbook = () =>
  safe(
    () =>
      db
        .select()
        .from(guestbookEntries)
        .where(eq(guestbookEntries.status, "approved"))
        .orderBy(desc(guestbookEntries.createdAt)),
    [],
  );
