import type { CookieOptions, Response } from "express";
import type { AuthTokens } from "../interfaces/services/token-service.interface";

const parseDurationToMs = (value: string): number | undefined => {
  const match = /^(\d+)(ms|s|m|h|d)$/.exec(value.trim());

  if (!match) {
    return undefined;
  }

  const amount = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return amount;
    case "s":
      return amount * 1000;
    case "m":
      return amount * 60 * 1000;
    case "h":
      return amount * 60 * 60 * 1000;
    case "d":
      return amount * 24 * 60 * 60 * 1000;
    default:
      return undefined;
  }
};

const isProduction = process.env.NODE_ENV === "production";

const createCookieOptions = (maxAge?: number): CookieOptions => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
  ...(maxAge ? { maxAge } : {})
});

const createClearCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/"
});

export const getAuthCookieOptions = (): {
  access: CookieOptions;
  refresh: CookieOptions;
} => ({
  access: createCookieOptions(parseDurationToMs(process.env.ACCESS_TOKEN_EXPIRATION ?? "15m")),
  refresh: createCookieOptions(parseDurationToMs(process.env.REFRESH_TOKEN_EXPIRATION ?? "7d"))
});

export const setAuthCookies = (res: Response, tokens: AuthTokens): void => {
  const options = getAuthCookieOptions();

  res.cookie("accessToken", tokens.accessToken, options.access);
  res.cookie("refreshToken", tokens.refreshToken, options.refresh);
};

export const clearAuthCookies = (res: Response): void => {
  const options = createClearCookieOptions();

  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);
};
