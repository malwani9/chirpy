import { NotFoundError } from "./api/errorMiddleware.js"
import type { MigrationConfig } from "drizzle-orm/migrator";

import { loadEnvFile } from 'node:process'
loadEnvFile();

type Config = {
    api: APIConfig;
    db: DBConfig;
    jwt: JWTConfig;
};

type APIConfig = {
    fileserverHits: number;
    port: number;
    platform: string;
};

const migrationConfig: MigrationConfig = {
        migrationsFolder: "./src/db/migrations",
};

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
}

type JWTConfig = {
  defaultDuration: number;
  secret: string;
  issuer: string;
};

export const config: Config = {
    api: {
        fileserverHits: 0,
        port: Number(getEnv("PORT")),
        platform: getEnv("PLATFORM"),
    },
    db: {
        url: getEnv("DB_URL"),
        migrationConfig,
    },
    jwt: {
        defaultDuration: 60 * 60,
        secret: getEnv("JWT_SECRET"),
        issuer: "chirpy",
    }
};

function getEnv(key: string): string {
    const connection_string = process.env[key];
    if (!connection_string) {
        throw new NotFoundError(`Missing environment variable: ${key} `);
    }

    return connection_string
}