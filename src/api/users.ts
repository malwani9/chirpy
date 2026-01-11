import type { Request, Response} from "express";
import { JSONResponse, ResponseData } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { NotFoundError, BadRequestError } from "./errorMiddleware.js";

type User = {
    email: string;
}
export async function createUserAsync(req: Request, res: Response) {
    const params : User = req.body;

    if (!params.email) {
        throw new BadRequestError("Missing required fields");
    }
    const result = await createUser({ email: params.email });

    if (!result) {
        throw new NotFoundError("Creation result not found");
    }

    let respBody: ResponseData = {};
    respBody.body = result;

    JSONResponse(res, 201, respBody.body);
}