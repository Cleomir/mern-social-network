import express, { Router } from "express";
import passport from "passport";

import createPost from "./createPost";

/**
 * Default Express router
 */
const router: Router = express.Router();

// mount HelloWorld route
router.post("/", passport.authenticate("jwt", { session: false }), createPost);

export default router;
