import express, { Router } from "express";

import helloWorld from "./helloWorld";

/**
 * Default Express router
 */
const router: Router = express.Router();

// mount HelloWorld route
router.get("/", helloWorld);

export default router;
