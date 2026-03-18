import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, hashPassword, makeJWT, validateJWT } from "./auth.js";
import { UserNotAuthenticatedError } from "./api/errorMiddleware.js";


describe("Password Hashing", () => {
  const password1 = "correctPassword123!";
  const password2 = "anotherPassword456!";
  let hash1: string;
  let hash2: string;

  beforeAll(async () => {
    hash1 = await hashPassword(password1);
    hash2 = await hashPassword(password2);
  });

  it("should return true for the correct password", async () => {
    const result = await checkPasswordHash(hash1, password1);
    expect(result).toBe(true);
  });
});

describe("JWT functions", () => {

  const userID = "123ABC";
  const expiresIn = 180;
  const VALID_SECRET   = 'correct-horse-battery-staple';
  const INVALID_SECRET = 'wrong-secret';
  let token: string;
  beforeAll(() => {
     token = makeJWT(userID, expiresIn, VALID_SECRET);
  });

  it("should validate a toekn", () => {
    const decoded = validateJWT(token, VALID_SECRET);
    expect(decoded).toBe(userID);
  });

   it("should return error for invalid token", () => {
      expect (() => validateJWT("invalid_token", VALID_SECRET))
      .toThrow(UserNotAuthenticatedError);
   });

  it("should return an error for invalid secret", () => {
    expect (() => validateJWT(token, INVALID_SECRET))
    .toThrow(UserNotAuthenticatedError);
    
  });

  it("should return an error for expired token", () => {
    const token = makeJWT(userID, -1, VALID_SECRET);
    expect (() => validateJWT(token, INVALID_SECRET))
    .toThrow(UserNotAuthenticatedError);
    
  });

 
});