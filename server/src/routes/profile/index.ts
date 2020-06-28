import express, { Router } from "express";
import passport from "passport";

import createProfile from "./create";
import deleteProfileAndUser from "./deleteProfileAndUser";
import addEducation from "./education/addEducation";
import deleteEducation from "./education/deleteEducation";
import addExperience from "./experience/addExperience";
import deleteExperience from "./experience/deleteExperience";
import getAllProfiles from "./getAllProfiles";
import getCurrentUserProfile from "./getCurrentUserProfile";
import getProfileByHandle from "./getProfileByHandle";
import getProfileByUserId from "./getProfileByUserId";

const router: Router = express.Router();

// mount "profile" routes
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
router.get("/all", getAllProfiles);
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
router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  deleteProfileAndUser
);
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
router.get("/:user_id", getProfileByUserId);

export default router;
