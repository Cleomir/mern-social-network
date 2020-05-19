import { Request } from "express";

declare global {
  namespace Express {
    export interface User {
      id: string;
    }
  }
}
