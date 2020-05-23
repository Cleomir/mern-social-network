import express, { Router } from "express";
import passport from "passport";

import createPost from "./createPost";
import getAllPosts from "./getAllPosts";
import getPostById from "./getPostById";
import deletePost from "./deletePost";
import likePost from "./likePost";
import unlikePost from "./unlikePost";

/**
 * Default Express router
 */
const router: Router = express.Router();

// mount routes
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
