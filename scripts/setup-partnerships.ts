import { config } from "dotenv";
config({ path: ".env.local" });

import mysql from "mysql2/promise";

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3307),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  // 1. Table des candidatures de partenariat (utf8mb4 → supporte les emojis)
  await conn.execute(`
    CREATE TABLE IF NOT EXISTS \`partnership_applications\` (
      \`id\` bigint unsigned AUTO_INCREMENT NOT NULL,
      \`club_name\` varchar(191) NOT NULL,
      \`server\` varchar(191),
      \`contact_name\` varchar(191),
      \`contact\` varchar(255),
      \`links\` varchar(512),
      \`message\` text,
      \`answers\` text,
      \`logo_url\` varchar(512),
      \`status\` enum('new','read','accepted','rejected') NOT NULL DEFAULT 'new',
      \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT \`partnership_applications_id\` PRIMARY KEY(\`id\`)
    ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);

  // Ajouter logo_url si la table existait déjà sans cette colonne
  await conn.execute(`
    ALTER TABLE \`partnership_applications\`
    ADD COLUMN IF NOT EXISTS \`logo_url\` varchar(512) NULL;
  `);
  console.log("✔ Table partnership_applications prête.");

  // 2. Conversion sans perte de utf8mb3 → utf8mb4 pour toutes les tables concernées
  const [rows] = await conn.query<mysql.RowDataPacket[]>(
    `SELECT TABLE_NAME, TABLE_COLLATION
     FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_TYPE = 'BASE TABLE'
       AND TABLE_COLLATION LIKE 'utf8mb3%'`,
  );

  if (rows.length === 0) {
    console.log("✔ Toutes les tables sont déjà en utf8mb4.");
  } else {
    for (const row of rows) {
      const table = row.TABLE_NAME as string;
      await conn.query(
        `ALTER TABLE \`${table}\` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
      );
      console.log(`✔ ${table} converti en utf8mb4.`);
    }
  }

  // 3. Charset par défaut de la base (pour les futures tables)
  await conn.query(
    `ALTER DATABASE \`${process.env.DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
  );
  console.log("✔ Charset par défaut de la base réglé sur utf8mb4.");

  await conn.end();
  console.log("\n✨ Terminé — les emojis sont désormais pris en charge.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
