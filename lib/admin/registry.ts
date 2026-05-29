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
  recruitmentApplications,
} from "@/lib/db/schema";
import type { MySqlTable } from "drizzle-orm/mysql-core";

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "number"
  | "boolean"
  | "date"
  | "datetime"
  | "image"
  | "select";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  uploadCategory?: string;
  help?: string;
}

export interface ResourceDef {
  key: string;
  label: string;
  labelSingular: string;
  table: MySqlTable;
  fields: FieldDef[];
  listColumns: { name: string; label: string }[];
  orderBy?: string;
  canCreate?: boolean;
}

export const RESOURCES: Record<string, ResourceDef> = {
  posts: {
    key: "posts",
    label: "Journal",
    labelSingular: "Article",
    table: posts,
    canCreate: true,
    listColumns: [
      { name: "title", label: "Titre" },
      { name: "isDraft", label: "Brouillon" },
      { name: "publishedAt", label: "Publié le" },
    ],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "slug", label: "Slug (URL)", type: "text", required: true, help: "Ex. soiree-nacree" },
      { name: "excerpt", label: "Accroche", type: "textarea" },
      { name: "body", label: "Contenu", type: "markdown" },
      { name: "coverUrl", label: "Image de couverture", type: "image", uploadCategory: "posts" },
      { name: "publishedAt", label: "Date de publication", type: "datetime" },
      { name: "isDraft", label: "Brouillon (non visible)", type: "boolean" },
    ],
  },
  evenements: {
    key: "evenements",
    label: "Événements",
    labelSingular: "Événement",
    table: events,
    canCreate: true,
    listColumns: [
      { name: "title", label: "Titre" },
      { name: "status", label: "Statut" },
      { name: "startsAt", label: "Début" },
    ],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "slug", label: "Slug (URL)", type: "text", required: true },
      { name: "excerpt", label: "Accroche", type: "textarea" },
      { name: "body", label: "Description", type: "markdown" },
      { name: "coverUrl", label: "Image", type: "image", uploadCategory: "events" },
      { name: "startsAt", label: "Date de début", type: "datetime" },
      { name: "endsAt", label: "Date de fin", type: "datetime" },
      {
        name: "status",
        label: "Statut",
        type: "select",
        options: [
          { value: "upcoming", label: "À venir" },
          { value: "past", label: "Passé" },
        ],
      },
      { name: "isHighlight", label: "Mettre en avant (accueil)", type: "boolean" },
    ],
  },
  staff: {
    key: "staff",
    label: "Équipe",
    labelSingular: "Membre",
    table: staff,
    canCreate: true,
    listColumns: [
      { name: "name", label: "Nom" },
      { name: "role", label: "Rôle" },
      { name: "isActive", label: "Actif" },
    ],
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "role", label: "Rôle", type: "text", required: true },
      { name: "avatarUrl", label: "Photo / Avatar", type: "image", uploadCategory: "staff" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sortOrder", label: "Ordre d'affichage", type: "number" },
      { name: "isActive", label: "Actif", type: "boolean" },
    ],
  },
  "galerie-categories": {
    key: "galerie-categories",
    label: "Galerie · Catégories",
    labelSingular: "Catégorie",
    table: galleryCategories,
    canCreate: true,
    listColumns: [
      { name: "name", label: "Nom" },
      { name: "slug", label: "Slug" },
    ],
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "slug", label: "Slug (URL)", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sortOrder", label: "Ordre", type: "number" },
    ],
  },
  "galerie-items": {
    key: "galerie-items",
    label: "Galerie · Médias",
    labelSingular: "Média",
    table: galleryItems,
    canCreate: true,
    listColumns: [
      { name: "caption", label: "Légende" },
      { name: "type", label: "Type" },
      { name: "categoryId", label: "Catégorie (id)" },
    ],
    fields: [
      { name: "categoryId", label: "ID de catégorie", type: "number", required: true },
      {
        name: "type",
        label: "Type",
        type: "select",
        options: [
          { value: "photo", label: "Photo" },
          { value: "video", label: "Vidéo" },
        ],
      },
      { name: "url", label: "Fichier", type: "image", uploadCategory: "gallery", required: true },
      { name: "thumbnailUrl", label: "Miniature (vidéo)", type: "image", uploadCategory: "gallery" },
      { name: "caption", label: "Légende", type: "text" },
      { name: "sortOrder", label: "Ordre", type: "number" },
    ],
  },
  tenues: {
    key: "tenues",
    label: "Tenues",
    labelSingular: "Tenue",
    table: outfits,
    canCreate: true,
    listColumns: [
      { name: "name", label: "Nom" },
      { name: "horse", label: "Cheval" },
    ],
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "description", label: "Description", type: "textarea" },
      {
        name: "colorsJson",
        label: "Couleurs",
        type: "text",
        help: 'Liste séparée par des virgules, ex. #FDFBF7, #C9A66B',
      },
      { name: "horse", label: "Cheval associé", type: "text" },
      { name: "imageUrl", label: "Image", type: "image", uploadCategory: "outfits" },
      { name: "sortOrder", label: "Ordre", type: "number" },
    ],
  },
  partenaires: {
    key: "partenaires",
    label: "Partenaires",
    labelSingular: "Partenaire",
    table: partners,
    canCreate: true,
    listColumns: [
      { name: "name", label: "Nom" },
      { name: "url", label: "Lien" },
    ],
    fields: [
      { name: "name", label: "Nom", type: "text", required: true },
      { name: "logoUrl", label: "Logo", type: "image", uploadCategory: "partners" },
      { name: "url", label: "Lien (URL)", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "sortOrder", label: "Ordre", type: "number" },
    ],
  },
  faq: {
    key: "faq",
    label: "FAQ",
    labelSingular: "Question",
    table: faqEntries,
    canCreate: true,
    listColumns: [{ name: "question", label: "Question" }],
    fields: [
      { name: "question", label: "Question", type: "text", required: true },
      { name: "answer", label: "Réponse", type: "textarea", required: true },
      { name: "sortOrder", label: "Ordre", type: "number" },
    ],
  },
  "hall-of-fame": {
    key: "hall-of-fame",
    label: "Hall of Fame",
    labelSingular: "Entrée",
    table: hallOfFame,
    canCreate: true,
    listColumns: [
      { name: "title", label: "Titre" },
      { name: "year", label: "Année" },
    ],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true },
      { name: "subtitle", label: "Sous-titre", type: "text" },
      { name: "body", label: "Description", type: "textarea" },
      { name: "imageUrl", label: "Image", type: "image", uploadCategory: "hall-of-fame" },
      { name: "year", label: "Année", type: "text" },
      { name: "sortOrder", label: "Ordre", type: "number" },
    ],
  },
  "livre-or": {
    key: "livre-or",
    label: "Livre d'Or",
    labelSingular: "Message",
    table: guestbookEntries,
    canCreate: false,
    listColumns: [
      { name: "author", label: "Auteur" },
      { name: "isPublished", label: "Publié" },
      { name: "createdAt", label: "Reçu le" },
    ],
    fields: [
      { name: "author", label: "Auteur", type: "text", required: true },
      { name: "message", label: "Message", type: "textarea", required: true },
      { name: "isPublished", label: "Publié (visible sur le site)", type: "boolean" },
    ],
  },
  recrutement: {
    key: "recrutement",
    label: "Candidatures",
    labelSingular: "Candidature",
    table: recruitmentApplications,
    canCreate: false,
    listColumns: [
      { name: "pseudo", label: "Pseudo" },
      { name: "status", label: "Statut" },
      { name: "createdAt", label: "Reçu le" },
    ],
    fields: [
      { name: "pseudo", label: "Pseudo", type: "text", required: true },
      { name: "discord", label: "Discord", type: "text" },
      { name: "message", label: "Message", type: "textarea" },
      {
        name: "status",
        label: "Statut",
        type: "select",
        options: [
          { value: "new", label: "Nouvelle" },
          { value: "read", label: "Lue" },
          { value: "accepted", label: "Acceptée" },
          { value: "rejected", label: "Refusée" },
        ],
      },
    ],
  },
};

export function getResource(key: string): ResourceDef | null {
  return RESOURCES[key] ?? null;
}

export const RESOURCE_NAV = Object.values(RESOURCES).map((r) => ({
  key: r.key,
  label: r.label,
}));
