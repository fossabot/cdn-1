import { Router } from "express";
const router = Router();

// Import Routes
import user from "./user";
import url from "./url";
// Use Routes
router.use("/user", user);
router.use("/url", url);

export default router;