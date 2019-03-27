import { Router } from "express";

// Legacy / Common
import { deleteKey, getData } from "./controllers/common";

// Refactored
import { getOrganisaatio, getOrganisaatiot } from "./controllers/organisaatiot";
import { getKoulutusaste, getKoulutusasteet, getKoulutusasteetChildren, getKoulutusasteetParents } from "./controllers/koulutusasteet";
import { getKohderyhma, getKohderyhmat } from "./controllers/kohderyhmat";
import { getKayttokohde, getKayttokohteet } from "./controllers/kayttokohteet";
import { getSaavutettavuudenTukitoiminnot, getSaavutettavuudenTukitoiminto } from "./controllers/saavutettavuuden-tukitoiminnot";
import {
  getSaavutettavuudenAvustavaTeknologia,
  getSaavutettavuudenAvustavatTeknologiat
} from "./controllers/saavutettavuuden-avustavatteknologiat";
import { getSaavutettavuudenKayttotapa, getSaavutettavuudenKayttotavat } from "./controllers/saavutettavuuden-kayttotavat";
import { getSaavutettavuudenEste, getSaavutettavuudenEsteet } from "./controllers/saavutettavuuden-esteet";
import { getKielet, getKieli } from "./controllers/kielet";
import { getAsiasana, getAsiasanat } from "./controllers/asiasanat";
import { getTieteenala, getTieteenalat } from "./controllers/tieteenalat";
import { getPeruskoulutuksenOppiaineet } from "./controllers/peruskoulutuksen-oppiaineet";

const router: Router = Router();

// GET routes
/**
 * Palauttaa tietueen redis tietokannasta
 * @group legacy
 * @route GET /{key}/{lang}
 * @param {string} key.path.required - Redis key
 * @param {string} lang.path.required - ISO 639-1 standardin mukainen langtunnus
 * @returns {object} 200 - OK
 * @returns {error} 404 - Not Found
 */
router.get("/legacy/:key/:lang", getData);

// DELETE routes
/**
 * Poistaa tietueen redis tietokannasta
 * @group legacy
 * @route DELETE /redis/delete/{key}
 * @param {string} key.path.required - Redis key
 * @returns {object} 200 - OK
 * @returns {error} 404 - Not Found
 */
router.delete("/redis/delete/:key", deleteKey);

// Refactor everything

/**
 * Returns all asiasanat from redis database by given language
 * @group Asiasanat (yso ontologia)
 * @route GET /asiasanat/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/asiasanat/:lang", getAsiasanat);

/**
 * Returns single asiasana from redis database by given id and language
 * @group Asiasanat (yso ontologia)
 * @route GET /asiasanat/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/asiasanat/:key/:lang", getAsiasana);

/**
 * Returns all organisaatiot from redis database by given language
 * @group Organisaatiot
 * @route GET /organisaatiot/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/organisaatiot/:lang", getOrganisaatiot);

/**
 * Returns single koulutusaste from redis database by given id and language
 * @group Organisaatiot
 * @route GET /organisaatiot/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/organisaatiot/:key/:lang", getOrganisaatio);

// router.get("/oppimateriaalityypit/:lang");
// router.get("/oppimateriaalityypit/:key/:lang");

/**
 * Returns all koulutusasteet from redis database by given language
 * @group Koulutusasteet
 * @route GET /koulutusasteet/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/koulutusasteet/:lang", getKoulutusasteet);

/**
 * Returns parent koulutusasteet from redis database by given language
 * @group Koulutusasteet
 * @route GET /koulutusasteet/parents/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/koulutusasteet/parents/:lang", getKoulutusasteetParents);

/**
 * Returns single koulutusaste from redis database by given id and language
 * @group Koulutusasteet
 * @route GET /koulutusasteet/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/koulutusasteet/:key/:lang", getKoulutusaste);

/**
 * Returns child koulutusasteet from redis database by given id and language
 * @group Koulutusasteet
 * @route GET /koulutusasteet/children/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/koulutusasteet/children/:key/:lang", getKoulutusasteetChildren);

/**
 * Returns all tieteenalat from redis database by given language
 * @group Tieteenalat
 * @route GET /tieteenalat/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/tieteenalat/:lang", getTieteenalat);

/**
 * Returns single tieteenala from redis database by given id and language
 * @group Tieteenalat
 * @route GET /tieteenalat/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/tieteenalat/:key/:lang", getTieteenala);

/**
 * Returns all kohderyhmat from redis database by given language
 * @group Kohderyhmät
 * @route GET /kohderyhmat/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/kohderyhmat/:lang", getKohderyhmat);

/**
 * Returns single kohderyhma from redis database by given id and language
 * @group Kohderyhmät
 * @route GET /kohderyhmat/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/kohderyhmat/:key/:lang", getKohderyhma);

/**
 * Returns all kayttokohteet from redis database by given language
 * @group Käyttökohteet (käyttö opetuksessa)
 * @route GET /kayttokohteet/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/kayttokohteet/:lang", getKayttokohteet);

/**
 * Returns single kayttokohde from redis database by given id and language
 * @group Käyttökohteet (käyttö opetuksessa)
 * @route GET /kayttokohteet/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/kayttokohteet/:key/:lang", getKayttokohde);

/**
 * Returns all saavutettavuudentukitoiminnot from redis database by given language
 * @group Saavutettavuuden tukitoiminnot
 * @route GET /saavutettavuudentukitoiminnot/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/saavutettavuudentukitoiminnot/:lang", getSaavutettavuudenTukitoiminnot);

/**
 * Returns single saavutettavuudentukitoiminto from redis database by given id and language
 * @group Saavutettavuuden tukitoiminnot
 * @route GET /saavutettavuudentukitoiminnot/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/saavutettavuudentukitoiminnot/:key/:lang", getSaavutettavuudenTukitoiminto);

/**
 * Returns all saavutettavuudenavustavatteknologiat from redis database by given language
 * @group Saavutettavuutta avustavat teknologiat
 * @route GET /saavutettavuudenavustavatteknologiat/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/saavutettavuudenavustavatteknologiat/:lang", getSaavutettavuudenAvustavatTeknologiat);

/**
 * Returns single saavutettavuudenavustavateknologia from redis database by given id and language
 * @group Saavutettavuutta avustavat teknologiat
 * @route GET /saavutettavuudenavustavatteknologiat/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/saavutettavuudenavustavatteknologiat/:key/:lang", getSaavutettavuudenAvustavaTeknologia);

/**
 * Returns all saavutettavuudenkayttotavat from redis database by given language
 * @group Saavutettavuuden käyttötavat
 * @route GET /saavutettavuudenkayttotavat/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/saavutettavuudenkayttotavat/:lang", getSaavutettavuudenKayttotavat);

/**
 * Returns single saavutettavuudenkayttotapa from redis database by given id and language
 * @group Saavutettavuuden käyttötavat
 * @route GET /saavutettavuudenkayttotavat/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/saavutettavuudenkayttotavat/:key/:lang", getSaavutettavuudenKayttotapa);

/**
 * Returns all saavutettavuudenesteet from redis database by given language
 * @group Saavutettavuuden esteet
 * @route GET /saavutettavuudenesteet/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/saavutettavuudenesteet/:lang", getSaavutettavuudenEsteet);

/**
 * Returns single saavutettavuudeneste from redis database by given id and language
 * @group Saavutettavuuden esteet
 * @route GET /saavutettavuudenesteet/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/saavutettavuudenesteet/:key/:lang", getSaavutettavuudenEste);

/**
 * Returns all kielet from redis database by given language
 * @group Kielet
 * @route GET /kielet/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/kielet/:lang", getKielet);

/**
 * Returns single kieli from redis database by given id and language
 * @group Kielet
 * @route GET /kielet/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/kielet/:key/:lang", getKieli);

/**
 * Returns all peruskoulutuksenoppiaineet from redis database by given language
 * @group Peruskoulutuksen oppiaineet
 * @route GET /peruskoulutuksenoppiaineet/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/peruskoulutuksenoppiaineet/:lang", getPeruskoulutuksenOppiaineet);

/**
 * Returns single peruskoulutuksen oppiaine from redis database by given id and language
 * @group Peruskoulutuksen oppiaineet
 * @route GET /peruskoulutuksenoppiaineet/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get("/peruskoulutuksenoppiaineet/:key/:lang");

export default router;
