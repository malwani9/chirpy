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

  if (err instanceof BadRequestError) {
    errorResponse(res, err.statusCode, err.message);
  } else if (err instanceof UserNotAuthenticatedError) {
    errorResponse(res, err.statusCode, err.message);
  } else if (err instanceof PaymentRequiredError) {
    errorResponse(res, err.statusCode, err.message);
  } else if (err instanceof ForbiddenError) {
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
export class NotFoundError extends ChirpyError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ForbiddenError extends ChirpyError {
  constructor(message: string) {
    super(message, 403);
  }
}
export class PaymentRequiredError extends ChirpyError {
  constructor(message: string) {
    super(message, 402);
  }
}

export class UserNotAuthenticatedError extends ChirpyError {
  constructor(message: string) {
    super(message, 401);
  }
}

export class BadRequestError extends ChirpyError {
  constructor(message: string) {
    super(message, 400);
  }
}
