/* eslint-disable @typescript-eslint/no-non-null-assertion */
import dotenv from "dotenv";

dotenv.config();

export const env: { [key: string]: string } = {
  DB_URL: process.env.MONGO_URL!,
  JWT_SECRET: process.env.JWT_SECRET!,
  NODE_ENV: process.env.NODE_ENV!,
  SERVER_PORT: process.env.SERVER_PORT!,
};

/**
 * Check if all env variables are defined, otherwise an error is thrown
 */
export const checkUndefinedEnv = (): void => {
  for (const key in env) {
    if (!env[key]) {
      throw new Error(`Env variable ${key} is undefined`);
    }
  }
};
