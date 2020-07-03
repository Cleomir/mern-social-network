import express, { Router } from "express";
import passport from "passport";

import createPost from "./createPost";
import getAllPosts from "./getAllPosts";
import getPostById from "./getPostById";
import deletePost from "./deletePost";
import likePost from "./likePost";
import unlikePost from "./unlikePost";
import addComment from "./addComment";
import deleteComment from "./deleteComment";

/**
 * Default Express router
 */
const router: Router = express.Router();

// /posts routes
router.delete(
  "/comment/:post_id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  deleteComment
);
router.post(
  "/comment/:post_id",
  passport.authenticate("jwt", { session: false }),
  addComment
);
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  unlikePost
);
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  likePost
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
