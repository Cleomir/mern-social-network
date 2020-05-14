import { PassportStatic } from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";

import { JWT_SECRET } from "../config";

const jwtHandler = (passport: PassportStatic): void => {
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
};

export default jwtHandler;
