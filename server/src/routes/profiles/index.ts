import express, { Router } from "express";
import passport from "passport";

import createProfile from "./create";
import deleteProfileAndUser from "./deleteProfileAndUser";
import addEducation from "./education/addEducation";
import deleteEducation from "./education/deleteEducation";
import addExperience from "./experience/addExperience";
import deleteExperience from "./experience/deleteExperience";
import getAllProfiles from "./getAllProfiles";
import getProfileByHandle from "./getProfileByHandle";
import getProfileByUserId from "./getProfileByUserId";

const router: Router = express.Router();

// /profiles routes
router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  deleteExperience
);
router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  deleteEducation
);
router.get("/handle/:handle", getProfileByHandle);
router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  addExperience
);
router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  addEducation
);
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
