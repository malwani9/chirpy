import { describe, it, expect, beforeAll } from "vitest";
import { checkPasswordHash, extractApiKey, extractBearerToken, hashPassword, makeJWT, validateJWT } from "./auth.js";
import { BadRequestError, UserNotAuthenticatedError } from "./api/errorMiddleware.js";


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

describe("Get Bearer token", () => {
  it("should return a bearer token", () => {
    const token = "mySecretToken";
    const header = `Bearer ${token}`;
    expect(extractBearerToken(header)).toBe("mySecretToken");
  });

  it("should return the token even if there is extra parts", () => {
    const token = "mySecretToken";
    const header = `Bearer ${token} extra-data`;
    expect(extractBearerToken(header)).toBe(token);
  });

  it("should thorw a BadRequestError if the header consist at least of two parts", () => {
    const header = "Bearer";
    expect(() => extractBearerToken(header)).toThrow(BadRequestError);
  });

  it("should thorw a BadRequestError if the header does not starts with 'Bearer'", () => {
    const token = "mySecretToken";
    const header = `Basic ${token}`;
    expect(() => extractBearerToken(header)).toThrow(BadRequestError);
  });

  it("should thorw a BadRequestError if the header is empty", () => {
    const header = "";
    expect(() => extractBearerToken(header)).toThrow(BadRequestError);
  });

});


describe("Get API key", () => {
    it("should return correct api key", () => {
      const apiKey = "MyAPIKey";
      const header = `ApiKey ${apiKey}`;
      expect(extractApiKey(header)).toBe(apiKey);
    });

    it("should return correct api key with out extra data", () => {
      const apiKey = "MyAPIKey";
      const header = `ApiKey ${apiKey} extra-data`;
      expect(extractApiKey(header)).toBe(apiKey);
    });

    it("should throw a BadRequestError if  the heasder doesn't contian at least two parts", () => {
      const apiKey = "MyAPIKey";
      const header = `${apiKey}`;
      expect(() => extractApiKey(header)).toThrow(BadRequestError);
    });

    it("should throw a BadRequestError if  the heasder doesn't start with 'ApiKey'", () => {
      const apiKey = "MyAPIKey";
      const header = `API ${apiKey}`;
      expect(() => extractApiKey(header)).toThrow(BadRequestError);
    });

    it("should throw a BadRequestError if  the heasder is empty string", () => {
      const header = ``;
      expect(() => extractApiKey(header)).toThrow(BadRequestError);
    });

});