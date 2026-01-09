import { NotFoundError } from "./api/errorMiddleware.js"
const { loadEnvFile } = require('node:process');
loadEnvFile();

type APIConfig = {
    fileserverHits: number;
    dbURL: string
};

export const config: APIConfig = {
    fileserverHits: 0,
    dbURL: getEnv("DB_URL"),
} ;

function getEnv(key: string): string {
    const connection_string = process.env[key];
    if (!connection_string) {
        throw new NotFoundError(`Missing environment variable: ${key} `);
    }

    return connection_string
}