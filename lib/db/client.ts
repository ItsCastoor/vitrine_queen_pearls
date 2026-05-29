import "server-only";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const globalForDb = globalThis as unknown as {
  __qpPool?: mysql.Pool;
};

function createPool(): mysql.Pool {
  return mysql.createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3307),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    namedPlaceholders: true,
  });
}

export const pool = globalForDb.__qpPool ?? createPool();
if (process.env.NODE_ENV !== "production") {
  globalForDb.__qpPool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });

export { schema };
