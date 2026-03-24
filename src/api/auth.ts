import type { Request, Response} from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, UserNotAuthenticatedError } from "./errorMiddleware.js";
import { checkPasswordHash, makeJWT } from "../auth.js";
import { JSONResponse } from "./json.js";
import { UserResponse } from "../db/schema.js";
import { config } from "../config.js";

type parameters = {
    password: string;
    email: string;
    expiresInSeconds?: number;
}

type LoginResponse = UserResponse & { token: string;}

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
    
    let duration = config.jwt.defaultDuration;
    if (params.expiresInSeconds && (params.expiresInSeconds < config.jwt.defaultDuration)) {
        duration = params.expiresInSeconds;
    }

    const token = makeJWT(user.id, duration, config.jwt.secret);

    JSONResponse(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: token,
    } satisfies LoginResponse);
}