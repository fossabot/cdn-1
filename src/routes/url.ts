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

    // Check long URL
    if (isUri(longUrl)) {
        try {
            const urlsRef = firestore.collection("urls").doc(urlCode);

            await urlsRef.set({
                shortCode: urlCode,
                longUrl,
                shortUrl: `${baseURL}/${urlCode}`,
                createdAt: new Date()
            });

            res.status(201).json({
                shortUrl: `${baseURL}/${urlCode}`,
            });
        } catch (err) {
            console.error(err.stack);
            res.status(500).json("Internal Server Error");
        }
    } else {
        res.status(401).json("Invalid long URL");
    }
});

export default router;