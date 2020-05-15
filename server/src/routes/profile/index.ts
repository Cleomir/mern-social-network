import express, { Router } from "express";

import getProfile from "./getProfile";
import createProfile from "./createProfile";
import passport from "passport";

const router: Router = express.Router();

// mount "user" routes
router.get("/", passport.authenticate("jwt", { session: false }), getProfile);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createProfile
);

export default router;
