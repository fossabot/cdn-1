import { Router, Request, Response } from "express";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../lib/constants";
import { firestore } from "../lib/database";
const router = Router();

// @route       POST /api/user/create
// @desc        Create new user & assign a json web token
router.post("/create", async (req:Request, res:Response) => {
    // Get email value from body
    const { email } = req.body;
    // Generate new uuid
    const uid = uuid();
    // JWT Payload
    const payload = {
        email,
        uid,
    };
    // Generate JWT Token
    const token = jwt.sign(payload, jwtSecret);

    try {
        // Store values into firebase
        await firestore.collection("users").doc(uid).set({
            uid,
            email,
            administrator: false,
            token,
            createdAt: new Date(),
        });

        res.status(201).json("User Created");
    }
    catch (err) {
        console.error(err.stack);
        res.status(500).json("Internal Server Error");
    }
});

export default router;