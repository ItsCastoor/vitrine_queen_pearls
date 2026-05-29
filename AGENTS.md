<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# AGENTS.md — Vitrine Queen Pearls

> Règles **opérationnelles** pour tout agent (ou humain) qui contribue au code.
> Pour le contexte projet, charte graphique, schéma BDD : voir [`context.md`](./context.md).
> Pour démarrer le projet : voir [`README.md`](./README.md).

## Stack en un coup d'œil
- **Next.js 16.2** App Router · React 19 · TypeScript strict · Tailwind 4
- **Drizzle ORM** + `mysql2` → MySQL distant via **tunnel SSH** sur `127.0.0.1:3307`
- **Auth admin** unique : `iron-session` (cookie) + `bcryptjs`
- **Uploads** : disque local dans `public/uploads/<categorie>/`
- **Aucun utilisateur public.** Le site est une vitrine + un CMS admin.

## Commandes utiles
| But                              | Commande              |
|----------------------------------|-----------------------|
| Dev server                       | `npm run dev`         |
| Build production                 | `npm run build`       |
| Start production                 | `npm run start`       |
| Lint                             | `npm run lint`        |
| Générer migration Drizzle        | `npm run db:generate` |
| Pousser le schéma (dev rapide)   | `npm run db:push`     |
| Appliquer migrations             | `npm run db:migrate`  |
| Seed du compte admin initial     | `npm run db:seed`     |

Avant `db:*` ou `dev` : **ouvrir le tunnel SSH** (voir README).

## Règles Next.js 16 (à respecter strictement)
1. **`params` et `searchParams` sont async** :
   ```tsx
   // app/journal/[slug]/page.tsx
   export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
     const { slug } = await params
     // ...
   }
   ```
2. **Server Components par défaut.** Ajouter `"use client"` uniquement quand strictement nécessaire (interactivité, hooks React, événements DOM).
3. **Mutations = Server Actions** (`"use server"` en tête de fichier ou de fonction) ou **Route Handlers** (`app/api/.../route.ts`).
   Jamais d'appel BDD depuis un Client Component.
4. **Cookies / headers** : `import { cookies, headers } from "next/headers"` — ces APIs sont **async**, toujours `await`.
5. **Données** : préférer `fetch` côté serveur ou requêtes Drizzle directes dans le Server Component. Mettre en cache via `revalidate` ou `revalidatePath` après mutation.
6. **Images** : `next/image` pour tout contenu (sauf SVG décoratif inline).
7. **Polices** : `next/font/google` chargées dans `app/layout.tsx`.
8. **Métadonnées** : `export const metadata` ou `generateMetadata` (async) dans chaque page.
9. **Doc de référence locale** : `node_modules/next/dist/docs/` — consulter avant toute API douteuse.

## Structure du repo (cible)
```
app/
  layout.tsx                # nav + footer luxe, polices, metadata globales
  page.tsx                  # Accueil
  <route>/page.tsx          # pages publiques (cf. context.md §3)
  admin/
    layout.tsx              # garde session + chrome admin
    login/page.tsx
    page.tsx                # dashboard
    <ressource>/...         # CRUD
  api/
    admin/
      login/route.ts
      logout/route.ts
      upload/route.ts
lib/
  db/
    client.ts               # pool mysql2 + drizzle()
    schema.ts               # toutes les tables
    migrations/             # générées par drizzle-kit
  auth/
    session.ts              # iron-session helpers (getSession, requireAdmin)
    password.ts             # bcrypt hash/compare
  uploads.ts                # validation + écriture disque
  validation/               # schémas zod par ressource
scripts/
  seed-admin.ts             # crée l'admin depuis ADMIN_BOOTSTRAP_*
middleware.ts               # protège /admin/** (Next 16 : fichier `proxy.ts`)
drizzle.config.ts
.env.example
context.md
AGENTS.md
README.md
```

Alias d'import : `@/*` (à configurer dans `tsconfig.json` si pas déjà fait).

## Charte graphique condensée
- Palette : nacré `#FDFBF7`, rose poudré `#F3D9DC`, rose perle `#E8B4BC`, doré `#C9A66B`, doré profond `#A8854A`, texte `#1B1B1B`.
- Polices : *Cormorant Garamond* (serif, titres) + *Geist Sans* (corps).
- Effets : grain subtil, séparateurs perle SVG, boutons outline doré, animations douces (`fade-in-up`).
- **Ne pas faire** : néon, gradients agressifs, ombres dures, blocs de texte denses sans respiration.
- Détails complets dans `context.md` §2.

## Sécurité (non négociable)
- Tout endpoint sous `/admin` ou `/api/admin` doit vérifier la session via `requireAdmin()`.
- Validation `zod` systématique sur les entrées (formulaire, upload, query params).
- Bcrypt cost 12 minimum pour les mots de passe.
- Cookie session : `httpOnly`, `sameSite=lax`, `secure` en prod, `maxAge` raisonnable (ex. 7j).
- Jamais committer `.env.local` ni de secret. Toujours mettre à jour `.env.example` quand on ajoute une variable.
- Ne **jamais** exposer le port 3307 du tunnel SSH publiquement.

## Conventions de code
- **TypeScript strict**, pas de `any` implicite.
- Pages : `kebab-case` (dossier route Next), composants partagés : `PascalCase.tsx` dans `components/`.
- Pas de commentaires inutiles ; commenter seulement ce qui ne se devine pas.
- Préférer la composition de petits composants à une grosse page monolithique.
- Pas d'inline styles sauf cas exceptionnel — Tailwind ou variables CSS dans `globals.css`.
- Toute nouvelle dépendance doit être justifiée (taille, maintenance, valeur).

## Do / Don't
| ✅ Do                                                       | ❌ Don't                                                  |
|------------------------------------------------------------|-----------------------------------------------------------|
| Server Components + Server Actions par défaut              | Fetch direct BDD depuis un Client Component               |
| `await params` / `await cookies()` / `await headers()`     | Traiter `params` comme synchrone (Next 16 = async)        |
| Lire `node_modules/next/dist/docs/` en cas de doute        | Supposer que l'API Next 13/14 est encore valable          |
| `npm run lint` + `npm run build` avant de livrer           | Pousser sans vérifier que le build passe                  |
| Mettre à jour `.env.example` si on ajoute une var          | Commiter `.env.local`                                     |
| Petits composants ciblés, design respirant                 | Pages denses, blocs d'infos sans souffle visuel           |

## Quand on doute
1. Lire `context.md` (intentions, design, schéma).
2. Lire la doc Next locale (`node_modules/next/dist/docs/`).
3. Si vraiment ambigu : demander avant de coder.
