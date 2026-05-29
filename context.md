# Context — Vitrine Queen Pearls

> Référence longue durée du projet. À lire avant toute contribution.
> Pour les règles d'agent, voir [`AGENTS.md`](./AGENTS.md). Pour démarrer, voir [`README.md`](./README.md).

---

## 1. Le projet

**Queen Pearls** est un club privé (univers équestre / communautaire) à l'identité forte : élégance, féminité, raffinement, esprit "maison de couture".

Ce dépôt est le **site vitrine officiel** du club. Il a deux faces :

- une **vitrine publique** immersive (raconte une ambiance, pas un bloc d'informations) ;
- un **espace admin** privé permettant à l'équipe de gérer le contenu (images, descriptions, posts, événements…) sans toucher au code.

Phrase signature proposée :
> *« Plus qu'un club, une maison où l'élégance rencontre la passion. »*

### Public visé
- Visiteurs / candidates potentielles : doivent ressentir une ambiance, comprendre l'esprit du club, et savoir comment postuler.
- Membres : voient le site comme la vitrine de leur identité collective.
- Admin (interne) : 1 à 3 personnes max, accèdent au CMS pour publier.

### Principes éditoriaux
- Ton : élégant, chaleureux, légèrement poétique. Phrases courtes, vocabulaire choisi.
- Pas de jargon. Pas de remplissage. Chaque page doit *évoquer*, pas seulement informer.
- Toujours préférer une image bien placée à un paragraphe descriptif.

---

## 2. Identité visuelle

### Palette
| Rôle              | Hex       | Usage                                  |
|-------------------|-----------|----------------------------------------|
| Blanc nacré       | `#FDFBF7` | Fond principal                         |
| Rose poudré       | `#F3D9DC` | Fonds doux, cartes, bannières          |
| Rose perle        | `#E8B4BC` | Accents, hover, séparateurs            |
| Doré léger        | `#C9A66B` | Bordures, traits, micro-détails luxe   |
| Doré profond      | `#A8854A` | Texte d'accent rare, liens hover       |
| Texte profond     | `#1B1B1B` | Texte principal                        |
| Gris perle        | `#8A8580` | Texte secondaire                       |

> Les couleurs sont exposées en variables CSS dans `app/globals.css` (`--qp-nacre`, `--qp-rose`, `--qp-or`…) et consommées via Tailwind.

### Typographie
- **Serif** : *Cormorant Garamond* (via `next/font/google`) — titres, baselines, citations.
- **Sans** : *Geist Sans* (déjà installée) — corps de texte, UI, admin.
- **Mono** : *Geist Mono* — admin only (form labels techniques).

### Effets signature
- Fond nacré légèrement granuleux (overlay SVG `noise`).
- Séparateurs en perle (SVG : 3 perles dorées centrées).
- Boutons en outline doré, hover : remplissage rose poudré + lettrage doré.
- Animations douces : `fade-in-up` au scroll, parallax léger sur les hero.
- Pas de néon, pas de gradients agressifs, pas d'ombres dures.

### Inspirations
Magazine de luxe (Vogue), académie prestigieuse (papeterie, sceaux), univers romantique fantasy (perles, voiles).

---

## 3. Arborescence des pages

### Publiques
| Route               | Page                  | Source de contenu                       |
|---------------------|-----------------------|------------------------------------------|
| `/`                 | Accueil               | `site_settings` + `events` (à venir)    |
| `/club`             | Le Club               | `site_settings`                          |
| `/equipe`           | Équipe / Staff        | `staff`                                  |
| `/recrutement`      | Rejoindre             | `site_settings` + form → `recruitment_applications` |
| `/galerie`          | Galerie (index)       | `gallery_categories`                     |
| `/galerie/[cat]`    | Galerie catégorie     | `gallery_items`                          |
| `/evenements`       | Événements            | `events`                                 |
| `/evenements/[slug]`| Détail événement      | `events`                                 |
| `/tenues`           | Nos Tenues            | `outfits`                                |
| `/lore`             | Lore / Univers        | `site_settings`                          |
| `/journal`          | Journal / Actualités  | `posts`                                  |
| `/journal/[slug]`   | Article               | `posts`                                  |
| `/partenaires`      | Partenaires           | `partners`                               |
| `/faq`              | FAQ                   | `faq_entries`                            |
| `/livre-d-or`       | Livre d'Or            | `guestbook_entries` (read + form)        |
| `/hall-of-fame`     | Hall of Fame          | `hall_of_fame`                           |

### Admin (protégées)
| Route                   | Rôle                              |
|-------------------------|-----------------------------------|
| `/admin/login`          | Connexion (publique)              |
| `/admin`                | Dashboard                         |
| `/admin/posts`          | CRUD journal                      |
| `/admin/evenements`     | CRUD événements                   |
| `/admin/galerie`        | CRUD médias + catégories + upload |
| `/admin/staff`          | CRUD membres                      |
| `/admin/tenues`         | CRUD uniformes                    |
| `/admin/partenaires`    | CRUD partenaires                  |
| `/admin/faq`            | CRUD FAQ                          |
| `/admin/livre-or`       | Modération du livre d'or          |
| `/admin/hall-of-fame`   | CRUD                              |
| `/admin/parametres`     | Textes éditables + mot de passe   |

---

## 4. Stack technique (décisions figées)

| Domaine        | Choix                                  | Raison                              |
|----------------|-----------------------------------------|-------------------------------------|
| Framework      | **Next.js 16.2** App Router            | Déjà présent, RSC, Server Actions   |
| UI             | **Tailwind CSS 4** (PostCSS plugin)    | Déjà configuré                      |
| Langage        | TypeScript strict                      | Déjà configuré                      |
| BDD            | **MySQL / MariaDB** distant            | Hébergement existant                |
| Accès BDD      | **Tunnel SSH** → `127.0.0.1:3307`      | Pas d'exposition publique du SGBD   |
| Client BDD     | `mysql2` (driver) + **Drizzle ORM**    | Type-safe, léger, migrations propres|
| Auth admin     | Cookie de session (`iron-session`) + bcrypt | Un seul admin, simple, sûr     |
| Uploads        | Disque local `public/uploads/`         | Vitrine, pas de besoin objet store  |
| Validation     | `zod`                                  | Server Actions sûres                |
| Polices        | `next/font/google` (Cormorant + Geist) | Pas de FOUT, perf                   |
| Lint           | ESLint 9 (`eslint-config-next`)        | Déjà configuré                      |

> ⚠️ **Aucun système d'utilisateurs publics.** Pas de signup, pas de profils, pas de mots de passe utilisateur. Seul l'admin a un compte.

---

## 5. Modèle de données

Toutes les tables sont définies dans `lib/db/schema.ts` (Drizzle).

### Auth & paramètres
- **`admins`** (`id`, `username` UNIQUE, `password_hash`, `created_at`, `updated_at`)
  → Compte admin unique (peut être étendu plus tard si besoin).
- **`site_settings`** (`key` PK, `value` LONGTEXT, `updated_at`)
  → Stocke les blocs de texte éditables (`home.hero_title`, `club.histoire`, `lore.intro`, …).

### Contenu éditorial
- **`posts`** (`id`, `slug` UNIQUE, `title`, `excerpt`, `body` MARKDOWN, `cover_url`, `published_at`, `is_draft`)
- **`events`** (`id`, `slug` UNIQUE, `title`, `excerpt`, `body`, `cover_url`, `starts_at`, `ends_at`, `status` ENUM(`upcoming`,`past`), `is_highlight`)
- **`gallery_categories`** (`id`, `slug` UNIQUE, `name`, `sort_order`)
- **`gallery_items`** (`id`, `category_id` FK, `type` ENUM(`photo`,`video`), `url`, `thumbnail_url`, `caption`, `sort_order`)
- **`outfits`** (`id`, `name`, `description`, `colors_json`, `horse`, `image_url`, `sort_order`)
- **`staff`** (`id`, `name`, `role`, `avatar_url`, `description`, `sort_order`, `is_active`)
- **`partners`** (`id`, `name`, `logo_url`, `url`, `description`, `sort_order`)
- **`faq_entries`** (`id`, `question`, `answer`, `sort_order`)
- **`hall_of_fame`** (`id`, `title`, `subtitle`, `body`, `image_url`, `year`, `sort_order`)

### Interactions
- **`guestbook_entries`** (`id`, `author`, `message`, `created_at`, `is_published`)
  → Soumis par les visiteurs, **modération obligatoire** avant affichage.
- **`recruitment_applications`** (`id`, `pseudo`, `discord`, `message`, `created_at`, `status` ENUM(`new`,`read`,`accepted`,`rejected`))

### Médias
- **`media`** (`id`, `filename`, `path`, `mime`, `size`, `uploaded_at`)
  → Registre de tous les fichiers servis depuis `public/uploads/`.

---

## 6. Sécurité

- Cookie de session : `httpOnly`, `sameSite=lax`, `secure` en prod, signé via `SESSION_SECRET` (32+ chars).
- Mots de passe : **bcrypt** (cost 12).
- Le proxy Next.js (`proxy.ts`, ex-`middleware.ts`) protège `/admin/**` sauf `/admin/login`.
- Toutes les mutations passent par des **Server Actions** ou des **Route Handlers** vérifiant la session côté serveur.
- Rate-limit basique en mémoire sur `/api/admin/login` (10 tentatives / IP / 15 min).
- Validation systématique avec `zod` (entrée formulaire ET payload upload).
- Aucune donnée sensible ne doit être commitée. `.env.local` est ignoré par git.
- Le tunnel SSH doit rester local : ne **jamais** exposer le port 3307 publiquement.

---

## 7. Uploads

- Endpoint : `POST /api/admin/upload` (multipart).
- Destination : `public/uploads/<categorie>/<uuid>.<ext>` où `<categorie>` ∈ {`gallery`, `events`, `staff`, `posts`, `partners`, `outfits`, `hall-of-fame`, `misc`}.
- Limites : 10 Mo / fichier, MIME whitelist (`image/jpeg`, `image/png`, `image/webp`, `image/avif`, `video/mp4`, `video/webm`).
- Enregistrement en table `media` après écriture disque réussie.
- L'URL retournée (relative, ex. `/uploads/gallery/abc.webp`) est ensuite collée dans le champ approprié (cover_url, avatar_url, etc.).

---

## 8. Conventions de code

- **Server Components par défaut.** `"use client"` uniquement quand nécessaire (formulaire interactif, lightbox).
- **Mutations = Server Actions** (`"use server"`) ou Route Handlers. Jamais de fetch BDD côté client.
- `params` et `searchParams` sont **async** dans Next.js 16 → toujours `await params`.
- Imports : alias `@/*` (configuré dans `tsconfig.json`).
- Nommage fichiers : `kebab-case.tsx` pour pages, `PascalCase.tsx` pour composants React partagés.
- Pas de commentaires inutiles dans le code. Commenter seulement la logique non évidente.
- Toujours utiliser `next/image` pour les images du contenu (sauf SVG décoratif inline).
- Toujours utiliser `next/link` pour la navigation interne.

---

## 9. Décisions ouvertes (à trancher si besoin un jour)

- Internationalisation : **non** pour l'instant (FR uniquement).
- Newsletter / email transactionnel : **non**.
- Analytics : à voir, possible Plausible self-hosted plus tard.
- Multi-admin / rôles : possible via extension de la table `admins` (ajouter `role`), pas prioritaire.
