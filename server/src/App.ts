import express, { Application, Request, Response } from "express";

import index from "./routes";

/**
 * Express instance
 */
const app: Application = express();
// request body parser
app.use(express.json());
// mount root routes
app.use("/", index);
// 404 handler
app.use((req: Request, res: Response) => {
  const error: Error = new Error("not Found");

  return res.status(404).json({
    message: error.message,
    name: error.name,
    status: 404,
  });
});

export default app;
