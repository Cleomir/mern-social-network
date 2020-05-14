import express, { Router } from "express";

/**
 * Default Express router
 */
const router: Router = express.Router();

// mount HelloWorld route
router.get("/");

export default router;
