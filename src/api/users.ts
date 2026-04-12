import type { Request, Response} from "express";
import { JSONResponse } from "./json.js";
import { createUser, updateUserById } from "../db/queries/users.js";
import { NotFoundError, BadRequestError,  } from "./errorMiddleware.js";
import { getBearerToken, hashPassword, validateJWT } from "../auth.js";
import { UserResponse } from "../db/schema.js";
import { config } from "../config.js";

type parameters = {
    password: string;
    email: string;
}

export async function handlerUsersCreate(req: Request, res: Response) {

    const params : parameters = req.body;

    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }

    const hashed_password = await hashPassword(params.password);
    const user: UserResponse = await createUser({ hashed_password: hashed_password, email: params.email });

    if (!user) {
        throw new NotFoundError("Creation result not found");
    }

    
    JSONResponse(res, 201, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isChirpyRed: user.isChirpyRed,
    });
}

export async function handlerUserUpdate(req: Request, res: Response) {
    const accessToken  = getBearerToken(req);
    const userId = validateJWT(accessToken, config.jwt.secret);
    if (!accessToken || !userId) {
        res.status(401).send();
    }

    const params : parameters = req.body;

    if (!params.email || !params.password) {
        throw new BadRequestError("Missing required fields");
    }

    const hashedPassowrd = await hashPassword(params.password);
    const user: UserResponse = await updateUserById(userId, hashedPassowrd, params.email);

    if (!user) {
        throw new NotFoundError("Update result not found");
    }

    JSONResponse(res, 200, user);
}