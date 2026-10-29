// Dev-only: creates the Better Auth tables in the local SQLite file.
// (MongoDB needs no migration.)
import { DatabaseSync } from "node:sqlite";
import { getMigrations } from "better-auth/db/migration";

const db = new DatabaseSync(process.env.SQLITE_PATH || "./dev-auth.sqlite");
const { runMigrations, toBeCreated, toBeAdded } = await getMigrations({
  database: db,
  emailAndPassword: { enabled: true },
});
if (!toBeCreated.length && !toBeAdded.length) console.log("Database already up to date.");
else {
  await runMigrations();
  console.log("Migrated:", toBeCreated.map((t) => t.table).join(", "));
}
