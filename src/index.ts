import express from "express";
import { handlerReadiness } from "./api/readiness.js";
import { middlewareLogResponses } from "./api/middlewareLogResponses.js";
import { middlewareMetricsInc } from "./api/middlewareMetricsInc.js";
import { handlerHits } from "./api/hits.js";
import { handlerReset } from "./api/reset.js";
import { handlerValidateChirp } from "./api/chirps.js";


const app = express();
const PORT = 8080;

app.use(middlewareLogResponses);
app.use(express.json());

app.use("/app", middlewareMetricsInc, express.static("./src/app"));

app.get("/api/healthz", handlerReadiness);
app.get("/admin/metrics", handlerHits);
app.post("/admin/reset", handlerReset);
app.post("/api/validate_chirp", handlerValidateChirp);


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});