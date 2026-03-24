import "dotenv/config";

const getRequiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

const parsePort = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const port = Number(value);
  return Number.isInteger(port) && port > 0 ? port : fallback;
};

export interface EnvConfig {
  PORT: number;
  ACCESS_SECRET: string;
  REFRESH_SECRET: string;
  ACCESS_TOKEN_EXPIRATION: string;
  REFRESH_TOKEN_EXPIRATION: string;
  CORS_ORIGIN: string;
}

export const env: EnvConfig = Object.freeze({
  PORT: parsePort(process.env.PORT, 8000),
  ACCESS_SECRET: getRequiredEnv("ACCESS_SECRET"),
  REFRESH_SECRET: getRequiredEnv("REFRESH_SECRET"),
  ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION ?? "15m",
  REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION ?? "7d",
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "*"
});
