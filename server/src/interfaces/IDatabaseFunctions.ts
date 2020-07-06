import IUser from "./IUser";
import { Document } from "mongoose";

export interface IFindUser {
  (whereClause: Record<string, unknown>): Promise<IUser | null>;
}

export interface ISaveDocument {
  (document: Document): Promise<void>;
}
