import express, { Router } from "express";
import passport from "passport";

import getCurrentUserProfile from "./getCurrentUserProfile";
import createProfile from "./createProfile";
import getProfileByHandle from "./getProfileByHandle";

const router: Router = express.Router();

// mount "profile" routes
router.get("/handle/:handle", getProfileByHandle);
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getCurrentUserProfile
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createProfile
);

export default router;
