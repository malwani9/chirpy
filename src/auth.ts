import argon2 from "argon2";
import { NotFoundError, UserNotAuthenticatedError } from "./api/errorMiddleware.js";
import jwt, { JwtPayload } from "jsonwebtoken";

const TOKEN_ISSUER = "chirpy";

export async function hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
}

export async function checkPasswordHash(hash: string, password: string): Promise<boolean> {
    if (!password) return false;
    try {
        return await argon2.verify(hash, password);
    } catch (err) {
        return false;
    } 
}

type Payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
    const issuedAt = Math.floor(Date.now() / 1000);
    const expiresAt = issuedAt + expiresIn;
    const payload: Payload = {
        iss: TOKEN_ISSUER,
        sub: userID,
        iat: issuedAt,
        exp: expiresAt,
    }

    const token = jwt.sign(payload, secret);

    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    let decoded: Payload;
    try {
         decoded = jwt.verify(tokenString, secret) as jwt.JwtPayload;
    } catch (err) {
        throw new UserNotAuthenticatedError("Invalid token");
    }

    if (decoded.iss !== TOKEN_ISSUER) {
        throw new NotFoundError("Invalid issuer");
    }

    if (!decoded.sub) {
            throw new NotFoundError("No user ID in token");
    }
    
    return decoded.sub;  
}