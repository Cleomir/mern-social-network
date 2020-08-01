import express, { Router } from "express";
import passport from "passport";

import createPost from "./create";
import getAllPosts from "./getAll";
import getPostById from "./getById";
import deletePost from "./delete";
import likeRoutes from "./likes";
import commentRoutes from "./comments";

/**
 * Default Express router
 */
const router: Router = express.Router();

// /posts routes
router.use("/likes", likeRoutes);
router.use("/comments", commentRoutes);
router.get("/:id", getPostById);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  deletePost
);
router.post("/", passport.authenticate("jwt", { session: false }), createPost);
router.get("/", getAllPosts);

export default router;
