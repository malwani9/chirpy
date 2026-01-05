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
  let message = "Something went wrong on our end";

  console.log(err.message);

  errorResponse(res, code, message);
}

