import express, { Application, Request, Response } from "express";

import helmet from "helmet";
import passport from "passport";
import JwtHandler from "./authentication/jwt";
import posts from "./routes/posts";
import profile from "./routes/profile";
import users from "./routes/users";
import "./interfaces/merged/User"; // Add id to Request.User object
import requestLogger from "./middleware/requestLogger";

/**
 * Express instance
 */
const app: Application = express();

// remove sensible headers
app.use(helmet());
// json body parser
app.use(express.json());
// log requests' body
app.use(requestLogger());
// passport config
app.use(passport.initialize());
JwtHandler.validate(passport);
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
