import express from "express";
import compression from "compression"; // compress requests
import bodyParser from "body-parser";
import dotenv from "dotenv";

import * as eperusteetKoodisto from "./controllers/eperusteet-koodisto";
import * as ePerusteetAmosaa from "./controllers/eperusteet-amosaa";
import * as finto from "./controllers/finto";
import router from "./routes";

dotenv.config();

const app = express();

// Configuration
app.set("port", 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Prefixed routes
app.use("/api/v1", router);

export default app;
