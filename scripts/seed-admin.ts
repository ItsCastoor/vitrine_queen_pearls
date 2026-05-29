import { config } from "dotenv";
config({ path: ".env.local" });

import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";

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

  const [rows] = await conn.execute<mysql.RowDataPacket[]>(
    "SELECT id FROM admins WHERE username = ? LIMIT 1",
    [username],
  );

  const hash = await bcrypt.hash(password, 12);

  if (rows.length > 0) {
    await conn.execute("UPDATE admins SET password_hash = ? WHERE username = ?", [
      hash,
      username,
    ]);
    console.log(`✔ Admin « ${username} » déjà existant — mot de passe mis à jour.`);
  } else {
    await conn.execute(
      "INSERT INTO admins (username, password_hash) VALUES (?, ?)",
      [username, hash],
    );
    console.log(`✔ Admin « ${username} » créé.`);
  }

  await conn.end();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
