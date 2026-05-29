import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { db } from "@/lib/db/client";
import { media } from "@/lib/db/schema";

export const UPLOAD_CATEGORIES = [
  "gallery",
  "events",
  "staff",
  "posts",
  "partners",
  "outfits",
  "hall-of-fame",
  "misc",
] as const;

export type UploadCategory = (typeof UPLOAD_CATEGORIES)[number];

const MAX_SIZE = 10 * 1024 * 1024; // 10 Mo

const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

export interface SavedUpload {
  url: string;
  filename: string;
  mime: string;
  size: number;
}

export function isUploadCategory(value: string): value is UploadCategory {
  return (UPLOAD_CATEGORIES as readonly string[]).includes(value);
}

export async function saveUpload(
  file: File,
  category: UploadCategory,
): Promise<SavedUpload> {
  if (file.size === 0) {
    throw new Error("Fichier vide.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("Fichier trop volumineux (10 Mo maximum).");
  }

  const ext = MIME_EXT[file.type];
  if (!ext) {
    throw new Error(`Type de fichier non autorisé : ${file.type || "inconnu"}.`);
  }

  const filename = `${randomUUID()}.${ext}`;
  const relDir = path.posix.join("/uploads", category);
  const relPath = path.posix.join(relDir, filename);

  const absDir = path.join(process.cwd(), "public", "uploads", category);
  await fs.mkdir(absDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(absDir, filename), buffer);

  await db.insert(media).values({
    filename,
    path: relPath,
    mime: file.type,
    size: file.size,
  });

  return { url: relPath, filename, mime: file.type, size: file.size };
}
