# 🌸 Vitrine Queen Pearls

Site vitrine officiel du club **Queen Pearls** — esprit *luxury fashion house*, palette nacrée / rose poudré / dorée.
Construit avec **Next.js 16** (App Router), **Tailwind 4**, **Drizzle ORM** + **MySQL** (accédé via tunnel SSH), et un **espace admin** intégré pour gérer le contenu sans toucher au code.

> 📖 **Pour comprendre le projet** (intentions, design, modèle de données) : lire [`context.md`](./context.md).
> 🤖 **Pour contribuer au code** (règles, conventions) : lire [`AGENTS.md`](./AGENTS.md).

---

## ✨ Vue d'ensemble

- **Vitrine publique** : Accueil, Le Club, Équipe, Recrutement, Galerie, Événements, Tenues, Lore, Journal, Partenaires, FAQ, Livre d'Or, Hall of Fame.
- **Espace admin** (`/admin`) : compte unique en BDD (bcrypt), CRUD complet sur tout le contenu, upload d'images.
- **Pas d'utilisateurs publics** : aucun signup, aucun profil.

---

## 🧰 Pré-requis

| Outil           | Version       | Vérifier                   |
|-----------------|---------------|----------------------------|
| Node.js         | **≥ 20.x**    | `node --version`           |
| npm             | ≥ 10.x        | `npm --version`            |
| MySQL/MariaDB   | distant       | accès SSH au serveur       |
| Client SSH      | OpenSSH       | `ssh -V`                   |
| Git             | récent        | `git --version`            |

---

## 🚀 Procédure de démarrage

### 1. Cloner et installer

```bash
git clone <repo-url> vitrine_queens_pearl
cd vitrine_queens_pearl
npm install
```

### 2. Configurer les variables d'environnement

```bash
cp .env.example .env.local
```

Puis ouvrir `.env.local` et renseigner :

- `DB_USER`, `DB_PASSWORD`, `DB_NAME` (côté MySQL distant)
- `SESSION_SECRET` — chaîne aléatoire de 32+ caractères. Générer :
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `ADMIN_BOOTSTRAP_USERNAME` et `ADMIN_BOOTSTRAP_PASSWORD` — identifiants du premier compte admin (modifiables ensuite depuis `/admin/parametres`).

> ⚠️ `DB_HOST=127.0.0.1` et `DB_PORT=3307` sont fixés par défaut : c'est l'extrémité **locale** du tunnel SSH (voir étape suivante).

### 3. Ouvrir le tunnel SSH vers la BDD

La base MySQL n'est **pas exposée publiquement**. On y accède via un tunnel SSH qui relie le port `3307` de votre machine au port `3306` de la BDD sur le serveur distant.

Dans un terminal **dédié** (à laisser ouvert pendant tout le développement) :

```bash
ssh -N -L 3307:127.0.0.1:3306 <user>@<host-distant>
```

| Option              | Rôle                                                          |
|---------------------|---------------------------------------------------------------|
| `-N`                | N'exécute aucune commande distante, sert juste à porter le tunnel |
| `-L 3307:127.0.0.1:3306` | Mappe `localhost:3307` (local) → `127.0.0.1:3306` (sur le serveur SSH) |

Si vous utilisez une clé SSH spécifique :
```bash
ssh -N -L 3307:127.0.0.1:3306 -i ~/.ssh/queen_pearls user@host
```

Sur Windows (PowerShell), même commande (OpenSSH fourni par défaut sur Windows 10+).

**Vérifier que le tunnel fonctionne** :
```bash
# depuis un AUTRE terminal
mysql -h 127.0.0.1 -P 3307 -u <DB_USER> -p
```

### 4. Initialiser la base de données

```bash
# Crée / met à jour les tables à partir de lib/db/schema.ts
npm run db:push

# Crée le compte admin initial (depuis ADMIN_BOOTSTRAP_*)
npm run db:seed
```

> En production, préférer `npm run db:generate` (génère les migrations SQL) puis `npm run db:migrate` (les applique).
>
> **Note sur `db:push`** — Si les tables existent déjà, `drizzle-kit push` peut échouer avec
> `Error: Multiple primary key defined` (`ER_MULTIPLE_PRI_KEY`). C'est une limite connue de
> l'introspection MySQL de drizzle-kit avec les clés primaires `bigint unsigned auto_increment` :
> il ne détecte pas la PK existante et tente de la recréer. **Cela signifie que le schéma est
> déjà en place** — l'erreur est sans danger. Pour les évolutions de schéma ultérieures, utilisez
> le workflow de migrations (`db:generate` puis `db:migrate`) plutôt que `db:push`.

### 5. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) pour la vitrine, [http://localhost:3000/admin/login](http://localhost:3000/admin/login) pour l'admin.

---

## 📜 Scripts npm

| Commande                | Description                                          |
|-------------------------|------------------------------------------------------|
| `npm run dev`           | Serveur de dev (Turbopack)                           |
| `npm run build`         | Build de production                                  |
| `npm run start`         | Démarre le build de production                       |
| `npm run lint`          | Lint ESLint                                          |
| `npm run db:generate`   | Génère une migration SQL depuis le schéma Drizzle    |
| `npm run db:push`       | Synchronise la BDD avec le schéma (dev rapide)       |
| `npm run db:migrate`    | Applique les migrations SQL (prod)                   |
| `npm run db:seed`       | Crée le compte admin initial                         |

---

## 🗂️ Arborescence (résumé)

```
app/                    # Pages (publiques + /admin)
  api/admin/            # Route handlers admin (login, upload, …)
lib/
  db/                   # Drizzle (client, schema, migrations)
  auth/                 # Sessions, bcrypt
  uploads.ts            # Helper d'upload
public/uploads/         # Images uploadées par l'admin (non versionnées)
scripts/seed-admin.ts   # Bootstrap du compte admin
proxy.ts                # Protège /admin/** (convention Next.js 16)
context.md              # Contexte projet (référence)
AGENTS.md               # Règles de contribution
```

Arborescence complète des pages : voir [`context.md`](./context.md) §3.

---

## 🔐 Espace admin

- URL de connexion : `/admin/login`
- Compte unique, créé par `npm run db:seed`
- Mot de passe modifiable depuis `/admin/parametres`
- Toutes les routes `/admin/**` sont protégées par le proxy (`proxy.ts`)
- Sessions stockées dans un cookie `httpOnly` signé (`SESSION_SECRET`)

Depuis l'espace admin, on peut gérer :
- Posts du journal, événements, galerie (avec upload d'images)
- Équipe / staff, tenues, partenaires, FAQ, Hall of Fame
- Modération du Livre d'Or et des candidatures de recrutement
- Textes éditables des pages Accueil / Club / Lore

---

## 🩺 Dépannage

| Problème                                      | Piste                                                                 |
|-----------------------------------------------|------------------------------------------------------------------------|
| `ECONNREFUSED 127.0.0.1:3307`                 | Le tunnel SSH n'est pas ouvert — relancer la commande `ssh -N -L …`    |
| `ER_ACCESS_DENIED_ERROR`                      | Vérifier `DB_USER` / `DB_PASSWORD` dans `.env.local`                   |
| Port 3307 déjà utilisé                        | Vérifier qu'aucun autre tunnel/MySQL local ne l'occupe, ou changer le port (mettre à jour `.env.local` ET la commande SSH) |
| Le tunnel se ferme tout seul                  | Ajouter `-o ServerAliveInterval=60` à la commande SSH                  |
| Build qui échoue avec `params` synchrones     | Next.js 16 → `params` est async : `const { slug } = await params`      |

---

## 📚 Pour aller plus loin

- [`context.md`](./context.md) — identité, charte graphique, modèle de données
- [`AGENTS.md`](./AGENTS.md) — conventions de code, règles Next.js 16
- Doc Next.js locale : `node_modules/next/dist/docs/`
