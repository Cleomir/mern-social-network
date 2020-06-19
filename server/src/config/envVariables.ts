import env from "dotenv";

env.config();

export const DB_URL: string = process.env.MONGO_URL!;
export const ENVIRONMENT: string = process.env.NODE_ENV!;
export const SERVER_PORT: number = +process.env.SERVER_PORT!;
export const JWT_SECRET: string = process.env.JWT_SECRET!;
