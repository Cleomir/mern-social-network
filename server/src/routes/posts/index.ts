import express, { Router } from "express";
import passport from "passport";

import createPost from "./create";
import getAllPosts from "./getAll";
import getPostById from "./getById";
import deletePost from "./delete";
import addLike from "./likes/add";
import removeLike from "./likes/remove";
import addComment from "./comments/add";
import deleteComment from "./comments/delete";

/**
 * Default Express router
 */
const router: Router = express.Router();

// /posts routes
router.delete(
  "/comments/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  deleteComment
);
router.post(
  "/comments/:post_id",
  passport.authenticate("jwt", { session: false }),
  addComment
);
router.delete(
  "/likes/:post_id",
  passport.authenticate("jwt", { session: false }),
  removeLike
);
router.post(
  "/likes/:post_id",
  passport.authenticate("jwt", { session: false }),
  addLike
);
router.get("/:id", getPostById);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deletePost
);
router.post("/", passport.authenticate("jwt", { session: false }), createPost);
router.get("/", getAllPosts);

export default router;
