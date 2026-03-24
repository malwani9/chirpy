import { type Request, type Response} from "express";
import { JSONResponse } from "./json.js";
import { BadRequestError, NotFoundError } from "./errorMiddleware.js"
import { createChirp, getAllChirps, getChirpById } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";

type parameters = {
        body: string;
};

export async function handlerChirpsCreate(req: Request, res: Response) {

    const params: parameters = req.body;

    if (!params.body) {
        throw new BadRequestError("Missing required fields");
    }

    const token = getBearerToken(req);

    const userID = validateJWT(token, config.jwt.secret);

    const cleaned = validateChirp(params.body);

    const result = await createChirp({ body: cleaned, userId: userID});
    if (!result) {
        throw new NotFoundError("Creation result not found");
    }

    const chirp = {
        id: result.id,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        body: result.body,
        userId: userID,
    };

    
    JSONResponse(res, 201, chirp);  
    
}

export async function handlerAllChirps(_: Request, res: Response) {
    const chirps: parameters[] = await getAllChirps();
    if (chirps.length === 0 || !chirps) {
        throw new NotFoundError("Retreive result not found");
    }

    JSONResponse(res, 200, chirps);
}

export async function handlerGetChirp(req: Request, res: Response) {
    const { chirpId } = req.params;
    if (!chirpId || typeof chirpId !== "string") {
        throw new BadRequestError(`Invalid chirp id ${chirpId}`);
    }

    const chirp = await getChirpById(chirpId);
    
    if(!chirp) {
        throw new NotFoundError(`Chirp with id '${chirpId}' not found`);
    }

    JSONResponse(res, 200, chirp);

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
