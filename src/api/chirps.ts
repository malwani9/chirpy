import type { Request, Response} from "express";
import { JSONResponse } from "./json.js";
import { BadRequestError, NotFoundError } from "./errorMiddleware.js"
import { createChirp } from "../db/queries/chirps.js";

type Chirp = {
        body: string;
        userId: string;
};

export async function handlerChirpsCreate(req: Request, res: Response) {

    const profane = ["kerfuffle", "sharbert", "fornax"];
    const params: Chirp = req.body;

    if (!params.body || !params.userId) {
        throw new BadRequestError("Missing required fields");
    }

    if  (params.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    

    const request_words = params.body.split(" ");
    
    for (let i = 0; i < request_words.length; i++) {
        if (profane.includes(request_words[i].toLocaleLowerCase())) {
            request_words[i] = "****";
        }
    }

    const cleaned = request_words.join(" "); 

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