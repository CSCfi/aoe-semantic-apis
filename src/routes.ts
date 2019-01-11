import { Router } from "express";

import * as eperusteetKoodisto from "./controllers/eperusteet-koodisto";
import * as ePerusteetAmosaa from "./controllers/eperusteet-amosaa";
import * as finto from "./controllers/finto";

const router: Router = Router();

// Development purposes
router.get("/lukionkurssit", eperusteetKoodisto.getLukionkurssit);
router.get("/opetussuunnitelmat", ePerusteetAmosaa.getOpetussuunnitelmat);
router.get("/yso", finto.getYsoOntologia);

// Actual routes
// router.get("/aiheet/:lang/:search", handler.function);
// router.get("/oppiaineet/:lang/:search", handler.function);
// router.get("/opetussuunnitelmat/:lang/:search", handler.function);

export default router;
