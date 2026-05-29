import {
  mysqlTable,
  bigint,
  varchar,
  text,
  longtext,
  int,
  boolean,
  datetime,
  timestamp,
  mysqlEnum,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

const id = () => bigint("id", { mode: "number", unsigned: true }).autoincrement().primaryKey();

const createdAt = () =>
  timestamp("created_at").notNull().default(sql`CURRENT_TIMESTAMP`);
const updatedAt = () =>
  timestamp("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`).onUpdateNow();

export const admins = mysqlTable("admins", {
  id: id(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const siteSettings = mysqlTable("site_settings", {
  key: varchar("key", { length: 128 }).primaryKey(),
  value: longtext("value"),
  updatedAt: updatedAt(),
});

export const posts = mysqlTable("posts", {
  id: id(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  body: longtext("body"),
  coverUrl: varchar("cover_url", { length: 512 }),
  publishedAt: datetime("published_at"),
  isDraft: boolean("is_draft").notNull().default(true),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const events = mysqlTable("events", {
  id: id(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  body: longtext("body"),
  coverUrl: varchar("cover_url", { length: 512 }),
  startsAt: datetime("starts_at"),
  endsAt: datetime("ends_at"),
  status: mysqlEnum("status", ["upcoming", "past"]).notNull().default("upcoming"),
  isHighlight: boolean("is_highlight").notNull().default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const galleryCategories = mysqlTable("gallery_categories", {
  id: id(),
  slug: varchar("slug", { length: 191 }).notNull().unique(),
  name: varchar("name", { length: 191 }).notNull(),
  description: text("description"),
  sortOrder: int("sort_order").notNull().default(0),
});

export const galleryItems = mysqlTable("gallery_items", {
  id: id(),
  categoryId: bigint("category_id", { mode: "number", unsigned: true }).notNull(),
  type: mysqlEnum("type", ["photo", "video"]).notNull().default("photo"),
  url: varchar("url", { length: 512 }).notNull(),
  thumbnailUrl: varchar("thumbnail_url", { length: 512 }),
  caption: varchar("caption", { length: 255 }),
  sortOrder: int("sort_order").notNull().default(0),
  showOnHome: boolean("show_on_home").notNull().default(false),
  createdAt: createdAt(),
});

export const outfits = mysqlTable("outfits", {
  id: id(),
  name: varchar("name", { length: 191 }).notNull(),
  description: text("description"),
  colorsJson: text("colors_json"),
  horse: varchar("horse", { length: 191 }),
  imageUrl: varchar("image_url", { length: 512 }),
  sortOrder: int("sort_order").notNull().default(0),
});

export const staff = mysqlTable("staff", {
  id: id(),
  name: varchar("name", { length: 191 }).notNull(),
  role: varchar("role", { length: 191 }).notNull(),
  avatarUrl: varchar("avatar_url", { length: 512 }),
  description: text("description"),
  sortOrder: int("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
});

export const partners = mysqlTable("partners", {
  id: id(),
  name: varchar("name", { length: 191 }).notNull(),
  logoUrl: varchar("logo_url", { length: 512 }),
  url: varchar("url", { length: 512 }),
  description: text("description"),
  sortOrder: int("sort_order").notNull().default(0),
});

export const faqEntries = mysqlTable("faq_entries", {
  id: id(),
  question: varchar("question", { length: 512 }).notNull(),
  answer: text("answer").notNull(),
  sortOrder: int("sort_order").notNull().default(0),
});

export const hallOfFame = mysqlTable("hall_of_fame", {
  id: id(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  body: text("body"),
  imageUrl: varchar("image_url", { length: 512 }),
  year: varchar("year", { length: 16 }),
  sortOrder: int("sort_order").notNull().default(0),
});

export const guestbookEntries = mysqlTable("guestbook_entries", {
  id: id(),
  author: varchar("author", { length: 191 }).notNull(),
  message: text("message").notNull(),
  isPublished: boolean("is_published").notNull().default(false),
  createdAt: createdAt(),
});

export const recruitmentApplications = mysqlTable("recruitment_applications", {
  id: id(),
  pseudo: varchar("pseudo", { length: 191 }).notNull(),
  discord: varchar("discord", { length: 191 }),
  message: text("message"),
  status: mysqlEnum("status", ["new", "read", "accepted", "rejected"])
    .notNull()
    .default("new"),
  createdAt: createdAt(),
});

export const media = mysqlTable("media", {
  id: id(),
  filename: varchar("filename", { length: 255 }).notNull(),
  path: varchar("path", { length: 512 }).notNull(),
  mime: varchar("mime", { length: 128 }).notNull(),
  size: int("size").notNull().default(0),
  uploadedAt: createdAt(),
});

export type Admin = typeof admins.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type EventRow = typeof events.$inferSelect;
export type GalleryCategory = typeof galleryCategories.$inferSelect;
export type GalleryItem = typeof galleryItems.$inferSelect;
export type Outfit = typeof outfits.$inferSelect;
export type StaffMember = typeof staff.$inferSelect;
export type Partner = typeof partners.$inferSelect;
export type FaqEntry = typeof faqEntries.$inferSelect;
export type HallOfFameEntry = typeof hallOfFame.$inferSelect;
export type GuestbookEntry = typeof guestbookEntries.$inferSelect;
export type RecruitmentApplication = typeof recruitmentApplications.$inferSelect;
export type MediaItem = typeof media.$inferSelect;
