import express, { Router } from "express";
import passport from "passport";

import createPost from "./createPost";
import getAllPosts from "./getAllPosts";
import getPostById from "./getPostById";
import deletePost from "./deletePost";

/**
 * Default Express router
 */
const router: Router = express.Router();

// mount routes
router.get("/:id", getPostById);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deletePost
);
router.post("/", passport.authenticate("jwt", { session: false }), createPost);
router.get("/", getAllPosts);

export default router;
