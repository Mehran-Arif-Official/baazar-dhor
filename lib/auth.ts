import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { MongoClient } from "mongodb";

/**
 * Database:
 *  - production / Vercel → MongoDB (set MONGODB_URI)
 *  - local development without MONGODB_URI → a throw-away SQLite file (node:sqlite)
 */
function createDatabase() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };
    const client = (globalForMongo._mongoClient ??= new MongoClient(uri));
    return mongodbAdapter(client.db(process.env.MONGODB_DB || "bazardor"), { client });
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { DatabaseSync } = require("node:sqlite");
  return new DatabaseSync(process.env.SQLITE_PATH || "./dev-auth.sqlite");
}

const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  };
}
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  };
}

export const auth = betterAuth({
  database: createDatabase(),
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET || "dev-only-secret-change-me-in-production-0123456789",
  trustedOrigins: [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.VERCEL_BRANCH_URL ? `https://${process.env.VERCEL_BRANCH_URL}` : undefined,
  ].filter((v): v is string => !!v),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: false, // after sign-up the user is sent to the sign-in page
  },
  socialProviders,
});
