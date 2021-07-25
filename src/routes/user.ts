import { Router, Request, Response } from "express";
import verifyToken from "../lib/verifyToken";
import { v4 as uuid } from "uuid";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { jwtSecret } from "../lib/constants";
import { firestore } from "../lib/database";
const router = Router();

// @route       POST /api/user/create
// @desc        Create new user & assign a json web token
router.post("/create", verifyToken, (req:Request, res:Response) => {
    // Verify token stored in req.token
    jwt.verify(req.token, jwtSecret, async (err:VerifyErrors|null, authData:JwtPayload|undefined) => {
        // Send 403 if any error verifying token or if user is not authorized to access resource
        if (err) {
            res.sendStatus(403);
       }
       else {
            firestore.collection("users").doc(authData?.uid).get().then(async user => {
                if (!user.data()?.administrator) {
                    return res.sendStatus(403);
                }
                // Get user email value from body
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
                } catch (err) {
                    // If error, log error message & send 500 status code
                    console.error(err.stack);
                    res.status(500).json("Internal Server Error");
                }
            });
       }
    });
});

export default router;