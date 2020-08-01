import express, { Router } from "express";
import passport from "passport";

import addExperience from "./add";
import deleteExperience from "./delete";

const router: Router = express.Router();

router.delete(
  "/:exp_id",
  passport.authenticate("jwt", { session: false }),
  deleteExperience
);
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  addExperience
);

export default router;
