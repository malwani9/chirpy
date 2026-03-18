import type { Request, Response} from "express";
import { getUserByEmail } from "../db/queries/users.js";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./errorMiddleware.js";
import { checkPasswordHash } from "../auth.js";
import { JSONResponse } from "./json.js";
import { UserResponse } from "../db/schema.js";
import jwt, { JwtPayload } from "jsonwebtoken";

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
        throw new UnauthorizedError("incorrect email or password");
    }

    const match = await checkPasswordHash(user.hashed_password, params.password);
    if (!match) {
        throw new UnauthorizedError("incorrect email or password");
    }
    
    JSONResponse(res, 200, {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    } satisfies UserResponse);
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

    const payload: Payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn,
    }

    const token = jwt.sign(payload, secret);

    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const decoded = jwt.verify(tokenString, secret) as jwt.JwtPayload;
        if (!decoded.sub) {
            throw new NotFoundError("Token payload is missing subject");
        }
        return decoded.sub;
    } catch (err) {
        throw new UnauthorizedError("Unathorized access");
    }
    
}