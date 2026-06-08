import { config } from "dotenv";
config({ path: ".env.local" });

import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

// Tous les modules disponibles (doit rester synchronisé avec lib/auth/permissions.ts)
const ALL_MODULE_KEYS = [
  "posts", "evenements", "staff", "galerie-categories", "galerie-items",
  "tenues", "partenaires", "faq", "hall-of-fame", "livre-or", "recrutement",
  "parametres", "membres", "roles",
];

async function main() {
  const username = process.env.ADMIN_BOOTSTRAP_USERNAME;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!username || !password) {
    console.error(
      "✖ ADMIN_BOOTSTRAP_USERNAME et ADMIN_BOOTSTRAP_PASSWORD doivent être définis dans .env.local",
    );
    process.exit(1);
  }

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3307),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // 1. Créer (ou récupérer) le rôle Superadmin
  const [existingRoles] = await conn.execute<mysql.RowDataPacket[]>(
    "SELECT id FROM roles WHERE name = 'Superadmin' LIMIT 1",
  );

  let roleId: number;
  if (existingRoles.length > 0) {
    roleId = existingRoles[0].id as number;
    console.log(`✔ Rôle « Superadmin » déjà existant (id=${roleId}).`);
  } else {
    const [result] = await conn.execute<mysql.ResultSetHeader>(
      "INSERT INTO roles (name, description) VALUES ('Superadmin', 'Accès complet à tous les modules.')",
    );
    roleId = result.insertId;
    console.log(`✔ Rôle « Superadmin » créé (id=${roleId}).`);
  }

  // 2. S'assurer que toutes les permissions sont accordées au rôle Superadmin
  for (const moduleKey of ALL_MODULE_KEYS) {
    const [existing] = await conn.execute<mysql.RowDataPacket[]>(
      "SELECT id FROM role_permissions WHERE role_id = ? AND module_key = ? LIMIT 1",
      [roleId, moduleKey],
    );
    if (existing.length === 0) {
      await conn.execute(
        "INSERT INTO role_permissions (role_id, module_key) VALUES (?, ?)",
        [roleId, moduleKey],
      );
    }
  }
  console.log(`✔ Permissions Superadmin synchronisées (${ALL_MODULE_KEYS.length} modules).`);

  // 3. Créer ou mettre à jour le compte admin
  const [rows] = await conn.execute<mysql.RowDataPacket[]>(
    "SELECT id FROM admins WHERE username = ? LIMIT 1",
    [username],
  );

  const hash = await bcrypt.hash(password, 12);

  if (rows.length > 0) {
    await conn.execute(
      "UPDATE admins SET password_hash = ?, role_id = ?, is_enabled = 1 WHERE username = ?",
      [hash, roleId, username],
    );
    console.log(`✔ Admin « ${username} » déjà existant — mot de passe + rôle Superadmin mis à jour.`);
  } else {
    await conn.execute(
      "INSERT INTO admins (username, password_hash, is_enabled, role_id) VALUES (?, ?, 1, ?)",
      [username, hash, roleId],
    );
    console.log(`✔ Admin « ${username} » créé avec le rôle Superadmin.`);
  }

  await conn.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
