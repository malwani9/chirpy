import type { Request, Response} from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, NotFoundError, UserNotAuthenticatedError } from "./errorMiddleware.js";
import { checkPasswordHash, getBearerToken, makeJWT, makeRefreshToken } from "../auth.js";
import { JSONResponse } from "./json.js";
import { UserResponse } from "../db/schema.js";
import { config } from "../config.js";
import { createRefreshToken, getUserFromRefreshToken, revokeRefreshToekn } from "../db/queries/refresh.js";

type parameters = {
    password: string;
    email: string;
}

type LoginResponse = UserResponse & { 
    token: string;
    refreshToken: string;
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

    const token = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);

    const refreshToken = makeRefreshToken();

    const created = await createRefreshToken(user.id, refreshToken);
    if (!created) {
        throw new NotFoundError("Creation result not found");
    }

    JSONResponse(res, 200, {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: token,
        refreshToken: refreshToken,
    } satisfies LoginResponse);
}

export async function handlerRefresh(req: Request, res: Response) {

    const bearerToken = getBearerToken(req);
    const result = await getUserFromRefreshToken(bearerToken);
    if (!result) {
        throw new UserNotAuthenticatedError("invalid refresh token");
    }

    const user = result.user;
    const accessToken = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);

    type response = {
        token: string;
    };

    JSONResponse(res, 200, { token: accessToken } as response);
}

export async function handlerRevoke(req: Request, res: Response) {
    const refreshToken = getBearerToken(req);
    await revokeRefreshToekn(refreshToken);
    res.status(204).send();
}