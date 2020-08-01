import express, { Router } from "express";
import passport from "passport";

import addLike from "./add";
import removeLike from "./remove";

const router: Router = express.Router();

router.delete(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  removeLike
);
router.post(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  addLike
);

export default router;
