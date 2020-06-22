import { PassportStatic } from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import jwt, { SignOptions } from "jsonwebtoken";

import IJwtPayload from "../../interfaces/IJwtPayload";
import { JWT_SECRET } from "../../config/envVariables";

export default class JwtHandler {
  public static validate(passport: PassportStatic): void {
    const options = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
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
  }

  public static sign(payload: IJwtPayload): string {
    const options: SignOptions = { expiresIn: "1h" };
    return jwt.sign(payload, JWT_SECRET, options);
  }
}
