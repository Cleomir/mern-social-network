import jwt, { SignOptions } from "jsonwebtoken";

import IJwtPayload from "../interfaces/IJwtPayload";
import { JWT_SECRET } from "../config";

const signJwtToken = (payload: IJwtPayload): string => {
  const options: SignOptions = { expiresIn: "1h" };
  return jwt.sign(payload, JWT_SECRET, options);
};

export default signJwtToken;
