import express, { Router } from "express";
import passport from "passport";

import createProfile from "./create";
import deleteProfileAndUser from "./deleteProfileAndUser";
import getAllProfiles from "./getAll";
import getProfileByHandle from "./getByHandle";
import getProfileByUserId from "./getByUserId";
import educationRoutes from "./education";
import experienceRoutes from "./experience";

const router: Router = express.Router();

// /profiles routes
router.use("/education", educationRoutes);
router.use("/experience", experienceRoutes);
router.get("/handle/:handle", getProfileByHandle);
router.get("/:user_id", getProfileByUserId);
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  deleteProfileAndUser
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  createProfile
);
router.get("/", getAllProfiles);

export default router;
