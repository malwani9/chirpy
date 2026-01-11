import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./api/middlewareLogResponses.js";
import { middlewareMetricsInc } from "./api/middlewareMetricsInc.js";
import { handlerHits } from "./api/hits.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidateChirp } from "./api/chirps.js";
import { errorMiddleware } from "./api/errorMiddleware.js" ;
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";


const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

const app = express();

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", (req, res, next) => {
    Promise.resolve(handlerReadiness(req, res)).catch(next); 
});
app.get("/admin/metrics", (req, res, next) => {
    Promise.resolve(handlerHits(req, res)).catch(next); 
});
app.post("/admin/reset", (req, res, next) => {
    Promise.resolve(handlerReset(req, res)).catch(next); 
});
app.post("/api/validate_chirp",  (req, res, next) => {
    Promise.resolve(handlerValidateChirp(req, res)).catch(next); 
});

app.use(errorMiddleware as unknown as express.ErrorRequestHandler);

app.listen(config.api.port, () => {
    console.log(`Server is running at http://localhost:${config.api.port}`);
});