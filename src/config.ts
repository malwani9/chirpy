import { NotFoundError } from "./api/errorMiddleware.js"
import type { MigrationConfig } from "drizzle-orm/migrator";

const { loadEnvFile } = require('node:process');
loadEnvFile();

type Config = {
    api: APIConfig;
    db: DBConfig;
};

type APIConfig = {
    fileserverHits: number;
    port: number;
};

const migrationConfig: MigrationConfig = {
        migrationsFolder: "./src/db/migrations",
};

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
}

export const config: Config = {
    api: {
        fileserverHits: 0,
        port: Number(getEnv("PORT")),
    },
    db: {
        url: getEnv("DB_URL"),
        migrationConfig,
    }
};

function getEnv(key: string): string {
    const connection_string = process.env[key];
    if (!connection_string) {
        throw new NotFoundError(`Missing environment variable: ${key} `);
    }

    return connection_string
}