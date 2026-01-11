import type {Request, Response} from "express";
import { config } from "../config.js";
import { reset } from "../db/queries/users.js";
import { ForbiddenError } from "./errorMiddleware.js";

export async function handlerReset(_: Request, res: Response) {
    if ( config.api.platform !== "dev"){
        console.log(config.api.platform);
        throw new ForbiddenError("this reset endpoint only allowed in local dev environment");

    }
    config.api.fileserverHits = 0;
    await reset();

    res.write("Hitsb reset to 0");
    res.end();
}
