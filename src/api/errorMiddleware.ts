import { NextFunction } from "express";
import type { Response } from "express";
import { errorResponse } from "./json.js";

export function errorMiddleware(
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction,
)  {
  
  
  let code = 500;
  let message = "Internal Server Errors";

  if (err instanceof BadRequest) {
    errorResponse(res, err.statusCode, err.message);
  } else if (err instanceof Unauthorized) {
    errorResponse(res, err.statusCode, err.message);
  } else if (err instanceof PaymentRequired) {
    errorResponse(res, err.statusCode, err.message);
  } else if (err instanceof Forbidden) {
    console.log("forbidden")
    errorResponse(res, err.statusCode, err.message);
  } else if (err instanceof NotFoundError) {
    errorResponse(res, err.statusCode, err.message);
  } else {
    console.log(`${code} - ${message}`);
  }
  
}


class ChirpyError extends Error {
  public readonly statusCode: number;
  constructor(message: string, statusCode: number){
    super(message);
    this.statusCode = statusCode;
  } 
}
class NotFoundError extends ChirpyError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class Forbidden extends ChirpyError {
  constructor(message: string) {
    super(message, 403);
  }
}
class PaymentRequired extends ChirpyError {
  constructor(message: string) {
    super(message, 402);
  }
}

class Unauthorized extends ChirpyError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class BadRequest extends ChirpyError {
  constructor(message: string) {
    super(message, 400);
  }
}
