import type { Request, Response} from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errorMiddleware.js";
import { checkPasswordHash } from "../auth.js";
import { JSONResponse } from "./json.js";
import { UserResponse } from "../db/schema.js";

type parameters = {
    password: string;
    email: string;
}

export async function handlerLogin(req: Request, res: Response) {

    const params : parameters = req.body;
    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }

    const user = await getUserByEmail(params.email);

    if (!user) {
        throw new UserNotAuthenticatedError("incorrect email or password");
    }

    const match = await checkPasswordHash(user.hashed_password, params.password);
    if (!match) {
        throw new UserNotAuthenticatedError("incorrect email or password");
    }
    
    JSONResponse(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } satisfies UserResponse);
}