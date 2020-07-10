import IUser from "../IUser";
import { Document } from "mongoose";
import IProfile from "../IProfile";
import IPost from "../IPost";

export interface IFindOneUser {
  (whereClause: Record<string, unknown>, requestId: string): Promise<
    IUser | undefined
  >;
}

export interface IFindOnePost {
  (id: string, requestId: string): Promise<IPost | undefined>;
}

export interface ISaveOneDocument {
  (document: Document): Promise<void>;
}

export interface IDeleteOneDocument {
  (document: Document): Promise<void>;
}

export interface IFindOneProfile {
  (whereClause: Record<string, unknown>, requestId: string): Promise<
    IProfile | undefined
  >;
}
