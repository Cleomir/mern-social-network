import express, { Router } from "express";
import passport from "passport";

import getCurrentUserProfile from "./getCurrentUserProfile";
import createProfile from "./createProfile";
import getProfileByHandle from "./getProfileByHandle";
import getProfileByUserId from "./getProfileByUserId";
import getAllProfiles from "./getAllProfiles";
import addExperience from "./experience/addExperience";
import deleteExperience from "./experience/deleteExperience";
import addEducation from "./education/addEducation";
import deleteEducation from "./education/deleteEducation";
import deleteProfileAndUser from "./deleteProfileAndUser";

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
