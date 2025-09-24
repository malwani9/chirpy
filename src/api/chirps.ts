import type {Request, Response} from "express";
import { JSONResponse, ResponseData } from "./json.js";

export async function handlerValidateChirp(req: Request, res: Response) {
    type Chirp = {
        body: string;
    };

    const profane = ["kerfuffle", "sharbert", "fornax"];
    const params: Chirp = req.body;

    let respBody: ResponseData = {
        error: "",
        valid: false,
        cleanedBody: "",
    };

    if  (params.body.length > 140) {
        respBody.error = "Chirp is too long"
        JSONResponse(res, 400, respBody);
        return;
    }
    

    const request_words = params.body.split(" ");
    
    for (let i = 0; i < request_words.length; i++) {
        if (profane.includes(request_words[i].toLocaleLowerCase())) {
            request_words[i] = "****";
        }
    }

    respBody.cleanedBody = request_words.join(" "); 
    respBody.valid = true;
    JSONResponse(res, 200, respBody);  
}