import { Request, Response, Router } from "express";
import { firestore } from "../lib/database";
const router = Router();

// @route       /:code
// @desc        Redirect to original url
router.get("/:code", async (req:Request, res:Response) => {
    const urlCode = req.params.code;

    try {
        const urlsRef = await firestore.collection("urls").doc(urlCode).get();
        if (urlsRef.data()) {
            res.redirect(urlsRef.data()?.longUrl);
        }
        else {
            res.status(404).json("Could Not Find Code");
        }
    }
    catch (err) {
        console.error(err.stack);
        res.status(500).json("Internal Server Error");
    }
});

export default router;