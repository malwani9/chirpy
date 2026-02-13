import type { Response } from "express";

export function errorResponse(res: Response, code: number, message: string) {
    JSONResponse(res, code, { error: message })
}

export function JSONResponse(res: Response, code: number, payload: any) {
    res.header("Content-Type", "application/json");
    const response = JSON.stringify(payload);
    res.status(code).send(response);
}