import express, { Router } from "express";
import passport from "passport";

import addEducation from "./add";
import deleteEducation from "./delete";

const router: Router = express.Router();

router.delete(
  "/:edu_id",
  passport.authenticate("jwt", { session: false }),
  deleteEducation
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  addEducation
);

export default router;
