import type { Request, Response} from "express";
import { JSONResponse } from "./json.js";
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
    const user = await createUser({ email: params.email });

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