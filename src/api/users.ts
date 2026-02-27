import type { Request, Response} from "express";
import { JSONResponse } from "./json.js";
import { createUser } from "../db/queries/users.js";
import { NotFoundError, BadRequestError } from "./errorMiddleware.js";
import { hashPassword } from "../auth.js";
import { UserResponse } from "../db/schema.js";

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
    });
}