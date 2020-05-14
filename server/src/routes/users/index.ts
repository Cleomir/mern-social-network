import express, { Router } from "express";

import create from "./create";
import login from "./login";

const router: Router = express.Router();

// mount "user" routes
router.post("/register", create);
router.post("/login", login);

export default router;
