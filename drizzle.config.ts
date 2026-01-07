import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config({ path: "dev.env" });

const postgres = process.env.connection_string!;

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: postgres,
  },
});