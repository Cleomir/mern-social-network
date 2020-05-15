import express, { Application, Request, Response } from "express";
import passport from "passport";

import users from "./routes/users";
import profile from "./routes/profile";
import jwtHandler from "./helpers/jwtHandler";

/**
 * Express instance
 */
const app: Application = express();
// json body parser
app.use(express.json());
// passport config
app.use(passport.initialize());
jwtHandler(passport);
// mount root routes
app.use("/users", users);
app.use("/profile", profile);
// 404 handler
app.use((req: Request, res: Response) => {
  const error: Error = new Error("not Found");

  return res.status(404).json({
    message: error.message,
    status: 404,
  });
});

export default app;
