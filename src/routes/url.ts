import { Router, Response } from "express";
import verifyToken from "../lib/verifyToken";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../lib/constants";
import { isUri } from "valid-url";
import { baseURL } from "../lib/constants";
import { generate } from "shortid";
import { firestore } from "../lib/database";
const router = Router();

// @route       /api/url/shorten
// @desc        Shorten URL
router.post("/shorten", verifyToken, async (req:any, res: Response) => {
    // Verify token stored in req.token
    jwt.verify(req.token, jwtSecret, async (err: any) => {
        // Send 403 if any error verifying token or if user is not authorized to access resource
        if (err) {
            res.sendStatus(403);
        } else {
            // Get longUrl field from body
            const { longUrl } = req.body;

            // Check base URL and send 400 to indicate a bad request
            if (!isUri(baseURL)) {
                return res.status(400).json("Invalid Base URL");
            }

            // Create URL code
            const urlCode = generate();

            // Check long URL
            if (isUri(longUrl)) {
                try {
                    // Store collection & doc in a constant
                    const urlsRef = firestore.collection("urls").doc(urlCode);

                    // Insert data into DB
                    await urlsRef.set({
                        shortCode: urlCode,
                        longUrl,
                        shortUrl: `${baseURL}/${urlCode}`,
                        createdAt: new Date()
                    });

                    // Return the shortened url to user
                    res.status(201).json({
                        shortUrl: `${baseURL}/${urlCode}`,
                    });
                } catch (err) {
                    // If error, log error message & send 500 status code
                    console.error(err.stack);
                    res.status(500).json("Internal Server Error");
                }
            } else {
                // Long URL is bad send 400 to indicate a bad request
                res.status(400).json("Invalid long URL");
            }
        }
    });
});

export default router;