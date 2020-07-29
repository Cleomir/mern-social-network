import express, { Router } from "express";
import passport from "passport";

import createPost from "./create";
import getAllPosts from "./getAll";
import getPostById from "./getById";
import deletePost from "./delete";
import likePost from "./likes/like";
import unlikePost from "./likes/unlike";
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
