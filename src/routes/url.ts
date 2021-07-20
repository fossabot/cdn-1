import { Router, Request, Response } from "express";
import { isUri } from "valid-url";
import { baseURL } from "../lib/constants";
import { generate } from "shortid";
import { firestore } from "../lib/database";
const router = Router();

// @route       /api/url/shorten
// @desc        Shorten URL
router.post("/shorten", async (req: Request, res: Response) => {
    const { longUrl } = req.body;

    // Check base URL
    if (!isUri(baseURL)) {
        return res.status(401).json("Invalid Base URL");
    }

    // Create URL code
    const urlCode = generate();
});

export default router;