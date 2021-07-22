import { Response, NextFunction } from "express";

function verifyToken(req:any, res:Response, next:NextFunction) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== "undefined") {
        // Split at space
        const bearer = bearerHeader.split(" ");
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    }
    else {
        // Forbidden
        res.sendStatus(403);
    }
}

export default verifyToken;