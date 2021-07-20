import { Router } from "express";
const router = Router();

// Import Routes
import url from "./url";
// Use Routes
router.use("/url", url);

export default router;