import express, { Router } from "express";
import passport from "passport";

import createProfile from "./create";
import deleteProfileAndUser from "./deleteProfileAndUser";
import addEducation from "./education/add";
import deleteEducation from "./education/delete";
import addExperience from "./experience/add";
import deleteExperience from "./experience/delete";
import getAllProfiles from "./getAll";
import getProfileByHandle from "./getByHandle";
import getProfileByUserId from "./getByUserId";

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
