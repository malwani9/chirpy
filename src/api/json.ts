import type { Response } from "express";

export type ResponseData = {
    error: string;
    valid: boolean;
    cleanedBody: string;
};

export function JSONResponse(res: Response, code: number, payload: ResponseData) {
    res.header("Content-Type", "application/json");
    const response = JSON.stringify(payload);
    res.status(code).send(response);
}