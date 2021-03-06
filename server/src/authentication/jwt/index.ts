import { PassportStatic } from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import jwt, { SignOptions } from "jsonwebtoken";

import IJwtPayload from "../../interfaces/IJwtPayload";
import { env } from "../../config/envVariables";
import logger from "../../logger";

export const validateJWT = (passport: PassportStatic): void => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: env.JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(options, (jwtPayload, done) => {
      if (Date.now().valueOf() / 1000 > jwtPayload.exp) {
        // token expired
        done("unauthorized");
      }
      done(null, jwtPayload);
    })
  );
};

export const signJWT = (payload: IJwtPayload, requestId: string): string => {
  const options: SignOptions = { expiresIn: "1h" };
  logger.info(`[JWT][${requestId}] Generating JWT`);
  const token: string = jwt.sign(payload, env.JWT_SECRET, options);
  logger.info(`[JWT][${requestId}] JWT generated`);

  return token;
};
