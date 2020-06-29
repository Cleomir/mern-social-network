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

// global middleware
app.use(helmet());
app.use(express.json());
app.use(requestLogger());
app.use(passport.initialize());
JwtHandler.validate(passport);

// mount root routes
app.use("/users", users);
app.use("/profiles", profile);
app.use("/posts", posts);

// 404 handler
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    message: "Page not found",
  });
});

export default app;
