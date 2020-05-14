import IJwtPayload from "./IJwtPayload";

export default interface IUser extends IJwtPayload {
  password: string;
  date: Date;
}
