import express, { Router } from "express";
import passport from "passport";

import addComment from "./add";
import deleteComment from "./delete";

const router: Router = express.Router();

router.delete(
  "/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  deleteComment
);
router.post(
  "/:post_id",
  passport.authenticate("jwt", { session: false }),
  addComment
);

export default router;
