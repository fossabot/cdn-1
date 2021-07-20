import "dotenv/config";
import express, { Application } from "express";
import logger from "morgan";
import { __prod__ } from "./lib/constants";

// Init Express
const app:Application = express();

// Logging w/morgan
if (!__prod__) {
    app.use(logger("dev"));
}

// Import Index Route
import router from "./routes/index";
// Use Index Route
app.use("/api", router);

// Define Port
const port = process.env.PORT || 5500;

// Start Server
app.listen(port, () => console.log(`Server started in ${process.env.NODE_ENV} mode on port ${port}`));