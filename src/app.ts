import express from "express";
import compression from "compression"; // compress requests
import bodyParser from "body-parser";
import dotenv from "dotenv";
import session from "express-session";
import cors from "cors";

import router from "./routes";

import { setOrganisaatiot } from "./controllers/organisaatiot";
import { setKoulutusasteet } from "./controllers/koulutusasteet";
import { setKohderyhmat } from "./controllers/kohderyhmat";
import { setKayttokohteet } from "./controllers/kayttokohteet";
import { setSaavutettavuudenTukitoiminnot } from "./controllers/saavutettavuuden-tukitoiminnot";
import { setSaavutettavuudenAvustavatTeknologiat } from "./controllers/saavutettavuuden-avustavatteknologiat";
import { setSaavutettavuudenKayttotavat } from "./controllers/saavutettavuuden-kayttotavat";
import { setSaavutettavuudenEsteet } from "./controllers/saavutettavuuden-esteet";
import { setKielet } from "./controllers/kielet";
import { setAsiasanat } from "./controllers/asiasanat";
import { setTieteenalat } from "./controllers/tieteenalat";
import { setPeruskoulutuksenOppiaineet } from "./controllers/peruskoulutuksen-oppiaineet";
import { setOppimateriaalityypit } from "./controllers/oppimateriaalityypit";

dotenv.config();

const app = express();
const expressSwagger = require("express-swagger-generator")(app);

// Configuration
app.use(session({
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  },
  resave: false,
  saveUninitialized: true,
  secret: "ygDe7*1d@Z%PJLXE6FBGli5mN!%v^E",
  // store: new RedisStore(),
}));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Enable CORS for dev purposes
app.set("port", 3000);

// Init
// set data to redis (if not already set).
setAsiasanat();
setKoulutusasteet();
setKohderyhmat();
setKayttokohteet();
setSaavutettavuudenTukitoiminnot();
setSaavutettavuudenAvustavatTeknologiat();
setSaavutettavuudenKayttotavat();
setSaavutettavuudenEsteet();
setKielet();
setOrganisaatiot();
setTieteenalat();
setPeruskoulutuksenOppiaineet();
setOppimateriaalityypit();

// set cron jobs to run daily/weekly

// Prefixed routes
app.use("/api/v1", router);

// Swagger
const options = {
  swaggerDefinition: {
    info: {
      description: "Koodisto microservice",
      title: "koodisto-service",
      version: "1.0.0",
    },
    host: "localhost:3000",
    basePath: "/api/v1",
    produces: [
      "application/json"
    ],
    schemes: ["https"]
  },
  basedir: __dirname, // app absolute path
  files: ["./routes.js"] // Path to the API handle folder
};
expressSwagger(options);

export default app;
