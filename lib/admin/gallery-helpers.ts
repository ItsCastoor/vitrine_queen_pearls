import { db } from "@/lib/db/client";
import { galleryCategories, type GalleryCategory } from "@/lib/db/schema";
import { asc } from "drizzle-orm";

export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  try {
    return await db
      .select()
      .from(galleryCategories)
      .orderBy(asc(galleryCategories.sortOrder), asc(galleryCategories.name));
  } catch {
    return [];
  }
}

export function getCategoryOptions(categories: GalleryCategory[]) {
  return [
    { value: "", label: "Aucune (hors catégorie)" },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];
}
