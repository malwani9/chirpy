import type { Request, Response} from "express";
import { JSONResponse } from "./json.js";
import { BadRequestError } from "./errorMiddleware.js"
import { createChirp } from "../db/queries/chirps.js";
import { createUser } from "../db/queries/users.js";

export async function handlerChirps(req: Request, res: Response) {
    type Chirp = {
        body: string;
    };

    const profane = ["kerfuffle", "sharbert", "fornax"];
    const params: Chirp = req.body;


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

    const user = await createUser({ email: "saul@bettercall.com" });

    const chirp = await createChirp({ body: cleaned, userId: user.id});
    const body = chirp.body;
    const userId = chirp.userId;
    JSONResponse(res, 200, {
        body,
        userId
    });  
}