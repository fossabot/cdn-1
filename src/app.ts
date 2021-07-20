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

// Body Parser
app.use(express.urlencoded({
    extended: true,
}));
app.use(express.json());

// Import Index Route
import index from "./routes/index";
import api from "./routes/api";
// Use Index Route
app.use("/", index);
app.use("/api", api);

// Define Port
const port = process.env.PORT || 5500;

// Start Server
app.listen(port, () => console.log(`Server started in ${process.env.NODE_ENV} mode on port ${port}`));