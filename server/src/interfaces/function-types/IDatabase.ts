import IUser from "../IUser";
import { Document } from "mongoose";
import IProfile from "../IProfile";

export interface IFindOneUser {
  (whereClause: Record<string, unknown>): Promise<IUser | null>;
}

export interface ISaveOneDocument {
  (document: Document): Promise<void>;
}

export interface IFindOneProfile {
  (whereClause: Record<string, unknown>, requestId: string): Promise<
    IProfile | undefined
  >;
}
