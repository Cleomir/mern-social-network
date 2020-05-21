import express, { Application, Request, Response } from "express";
import passport from "passport";
import helmet from "helmet";

import users from "./routes/users";
import profile from "./routes/profile";
import posts from "./routes/posts";
import jwtHandler from "./helpers/jwtHandler";
import "./interfaces/merged/User";

/**
 * Express instance
 */
const app: Application = express();

app.use(helmet());
// json body parser
app.use(express.json());
// passport config
app.use(passport.initialize());
jwtHandler(passport);
// mount root routes
app.use("/users", users);
app.use("/profiles", profile);
app.use("/posts", posts);
// 404 handler
app.use((req: Request, res: Response) => {
  const error: Error = new Error("not Found");

  return res.status(404).json({
    message: error.message,
    status: 404,
  });
});

export default app;
