import { Request, Response, NextFunction } from "express";

function verifyToken(req:Request, res:Response, next:NextFunction) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== "undefined") {
        // Split at space
        const bearer = bearerHeader.split(" ");
        // Get & set the token from array
        req.token = bearer[1];
        // Next middleware
        next();
    }
    else {
        // Forbidden
        res.sendStatus(403);
    }
}

export default verifyToken;