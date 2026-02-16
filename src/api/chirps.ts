import type { Request, Response} from "express";
import { JSONResponse } from "./json.js";
import { BadRequestError, NotFoundError } from "./errorMiddleware.js"
import { createChirp, getAllChirps } from "../db/queries/chirps.js";
import { json } from "stream/consumers";

type Chirp = {
        body: string;
        userId: string;
};

export async function handlerChirpsCreate(req: Request, res: Response) {

    const params: Chirp = req.body;

    if (!params.body || !params.userId) {
        throw new BadRequestError("Missing required fields");
    }

    const cleaned = validateChirp(params.body);

    const result = await createChirp({ body: cleaned, userId: params.userId});
    if (!result) {
        throw new NotFoundError("Creation result not found");
    }

    const chirp: Chirp = {
        body: result.body,
        userId: result.userId
    };

    
    JSONResponse(res, 201, chirp);  
    
}

export async function handlerAllChirps(_: Request, res: Response) {
    const chirps: Chirp[] = await getAllChirps();
    if (chirps.length === 0 || !chirps) {
        throw new NotFoundError("Retreive result not found");
    }

    JSONResponse(res, 200, chirps);
}

function validateChirp(body: string) {
    const maxChirpLenght = 140;
    if  (body.length > maxChirpLenght) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }

    const profanes = ["kerfuffle", "sharbert", "fornax"];
    return cleanChirpBody(body, profanes)
}

function cleanChirpBody(body: string, profanes: string[]) {
    const words = body.split(" ");
    
    for (let i = 0; i < words.length; i++) {
        if (profanes.includes(words[i].toLocaleLowerCase())) {
            words[i] = "****";
        }
    }

    const cleaned = words.join(" ");
    return cleaned;
}
