import { Router } from 'express';

import { getOrganisaatio, getOrganisaatiot } from './controllers/organisaatiot';
import { getKoulutusaste, getKoulutusasteet } from './controllers/koulutusasteet';
import { getKohderyhma, getKohderyhmat } from './controllers/kohderyhmat';
import { getKayttokohde, getKayttokohteet } from './controllers/kayttokohteet';
import {
    getSaavutettavuudenTukitoiminnot,
    getSaavutettavuudenTukitoiminto,
} from './controllers/saavutettavuuden-tukitoiminnot';
import { getSaavutettavuudenEste, getSaavutettavuudenEsteet } from './controllers/saavutettavuuden-esteet';
import { getKielet, getKieli } from './controllers/kielet';
import { getAsiasana, getAsiasanat } from './controllers/asiasanat';
import { getTieteenalat } from './controllers/tieteenalat';
import { getOppimateriaalityypit, getOppimateriaalityyppi } from './controllers/oppimateriaalityypit';
import {
    getPerusopetuksenOppiaineet,
    getPerusopetuksenSisaltoalueet,
    getPerusopetuksenTavoitteet,
} from './controllers/perusopetus';
import { getLisenssi, getLisenssit } from './controllers/lisenssit';
import { getLukionkurssi, getLukionkurssit } from './controllers/lukionkurssit';
import { getLukionModuulit, getLukionOppiaineet, getLukionSisallot, getLukionTavoitteet } from './controllers/lukio';
import {
    getAmmattikoulunTutkinnonOsat,
    getAmmattikoulunPerustutkinnot,
    getAmmattikoulunVaatimukset,
    getAmmattikoulunAmmattitutkinnot,
    getAmmattikoulunErikoisammattitutkinnot,
} from './controllers/ammattikoulu';
import { getOppiaineetTieteenalatTutkinnot } from './controllers/filters';
import { getLukionVanhatKurssit, getLukionVanhatOppiaineet } from './controllers/vanha-lukio';

const router: Router = Router();

/**
 * @typedef Error
 * @property {string} error
 */

/**
 * @typedef Keyword
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef Organization
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef LearningResourceType
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef EducationalLevel
 * @property {string} key
 * @property {string} value
 * @property {Array.<EducationalLevelChild>} children
 */

/**
 * @typedef EducationalLevelChild
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef ScienceBranchParent
 * @property {string} key
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 * @property {Array.<ScienceBranch>} children
 */

/**
 * @typedef ScienceBranch
 * @property {string} key
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 * @property {string} targetUrl
 */

/**
 * @typedef EducationalRole
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef EducationalUse
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef AccessibilityFeature
 * @property {string} key
 * @property {string} value
 * @property {string} description
 */

/**
 * @typedef AccessibilityHazard
 * @property {string} key
 * @property {string} value
 * @property {string} description
 */

/**
 * @typedef Language
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef EducationalSubjectParent
 * @property {integer} key
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 * @property {Array.<EducationalSubject>} children
 */

/**
 * @typedef EducationalSubject
 * @property {integer} key
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 * @property {string} targetUrl
 */

/**
 * @typedef EducationalSubjectObjective
 * @property {integer} key
 * @property {string} parent
 * @property {integer} gradeEntity
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 * @property {string} targetUrl
 */

/**
 * @typedef EducationalSubjectContent
 * @property {integer} key
 * @property {string} parent
 * @property {integer} gradeEntity
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 * @property {string} targetUrl
 */

/**
 * @typedef License
 * @property {string} key
 * @property {string} value
 * @property {string} link
 * @property {string} description
 */

/**
 * @typedef UpperSecondarySchoolSubject
 * @property {string} key
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 * @property {string} targetUrl
 */

/**
 * @typedef UpperSecondarySchoolOldSubject
 * @property {string} key
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 */

/**
 * @typedef UpperSecondarySchoolOldCourse
 * @property {string} key
 * @property {string} parent
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 */

/**
 * @typedef UpperSecondarySchoolNewSubject
 * @property {integer} key
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 * @property {string} targetUrl
 */

/**
 * @typedef UpperSecondarySchoolNewModule
 * @property {integer} key
 * @property {string} parent
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 * @property {string} targetUrl
 */

/**
 * @typedef UpperSecondarySchoolNewModuleObjective
 * @property {string} key
 * @property {string} parent
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 */

/**
 * @typedef UpperSecondarySchoolNewModuleContent
 * @property {string} key
 * @property {string} parent
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 */

/**
 * @typedef VocationalQualification
 * @property {integer} key
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 * @property {string} targetUrl
 */

/**
 * @typedef VocationalQualificationUnit
 * @property {integer} key
 * @property {string} parent
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 */

/**
 * @typedef VocationalQualificationUnitRequirement
 * @property {integer} key
 * @property {string} parent
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 */

/**
 * @typedef FurtherVocationalQualification
 * @property {integer} key
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 * @property {string} targetUrl
 */

/**
 * @typedef SpecialistVocationalQualification
 * @property {integer} key
 * @property {string} source
 * @property {string} alignmentType
 * @property {string} targetName
 * @property {string} targetUrl
 */

/**
 * Returns all keywords from redis database by given language.
 * @group Asiasanat (yso ontologia)
 * @route GET /asiasanat/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<Keyword>} 200 - An array of keywords
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/asiasanat/:lang', getAsiasanat);

/**
 * Returns single keyword from redis database by given id and language.
 * @group Asiasanat (yso ontologia)
 * @route GET /asiasanat/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Keyword.model} 200 - Keyword
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/asiasanat/:key/:lang', getAsiasana);

/**
 * Returns all organizations from redis database by given language.
 * @group Organisaatiot
 * @route GET /organisaatiot/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<Organization>} 200 - An array of organizations
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/organisaatiot/:lang', getOrganisaatiot);

/**
 * Returns single organization from redis database by given id and language.
 * @group Organisaatiot
 * @route GET /organisaatiot/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Organization.model} 200 - Organization
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/organisaatiot/:key/:lang', getOrganisaatio);

/**
 * Returns all learning resource types from redis database by given language.
 * @group Oppimateriaalityypit
 * @route GET /oppimateriaalityypit/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<LearningResourceType>} 200 - An array of learning resource types
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/oppimateriaalityypit/:lang', getOppimateriaalityypit);

/**
 * Returns single learning resource type from redis database by given id and language.
 * @group Oppimateriaalityypit
 * @route GET /oppimateriaalityypit/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {LearningResourceType.model} 200 - Learning resource type
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/oppimateriaalityypit/:key/:lang', getOppimateriaalityyppi);

/**
 * Returns all educational levels from redis database by given language.
 * @group Koulutusasteet
 * @route GET /koulutusasteet/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<EducationalLevel>} 200 - An array of educational levels
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/koulutusasteet/:lang', getKoulutusasteet);

/**
 * Returns single educational level from redis database by given id and language.
 * @group Koulutusasteet
 * @route GET /koulutusasteet/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {EducationalLevel.model} 200 - Educational level
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/koulutusasteet/:key/:lang', getKoulutusaste);

/**
 * Returns all science branches from redis database by given language.
 * @group Tieteenalat
 * @route GET /tieteenalat/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<ScienceBranchParent>} 200 - An array of science branches
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/tieteenalat/:lang', getTieteenalat);

/**
 * Returns all educational roles from redis database by given language.
 * @group Kohderyhmät
 * @route GET /kohderyhmat/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<EducationalRole>} 200 - An array of educational roles
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/kohderyhmat/:lang', getKohderyhmat);

/**
 * Returns single educational role from redis database by given id and language.
 * @group Kohderyhmät
 * @route GET /kohderyhmat/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {EducationalRole.model} 200 - Educational role
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/kohderyhmat/:key/:lang', getKohderyhma);

/**
 * Returns all educational uses from redis database by given language.
 * @group Käyttökohteet (käyttö opetuksessa)
 * @route GET /kayttokohteet/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<EducationalUse>} 200 - An array of educational uses
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/kayttokohteet/:lang', getKayttokohteet);

/**
 * Returns single educational use from redis database by given id and language.
 * @group Käyttökohteet (käyttö opetuksessa)
 * @route GET /kayttokohteet/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {EducationalUse.model} 200 - Educational use
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/kayttokohteet/:key/:lang', getKayttokohde);

/**
 * Returns all accessibility features from redis database by given language.
 * @group Saavutettavuuden tukitoiminnot
 * @route GET /saavutettavuudentukitoiminnot/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<AccessibilityFeature>} 200 - An array of accessibility features
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/saavutettavuudentukitoiminnot/:lang', getSaavutettavuudenTukitoiminnot);

/**
 * Returns single accessibility feature from redis database by given id and language.
 * @group Saavutettavuuden tukitoiminnot
 * @route GET /saavutettavuudentukitoiminnot/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {AccessibilityFeature.model} 200 - Accessibility feature
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/saavutettavuudentukitoiminnot/:key/:lang', getSaavutettavuudenTukitoiminto);

/**
 * Returns all accessibility hazards from redis database by given language.
 * @group Saavutettavuuden esteet
 * @route GET /saavutettavuudenesteet/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<AccessibilityHazard>} 200 - An array of accessibility hazards
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/saavutettavuudenesteet/:lang', getSaavutettavuudenEsteet);

/**
 * Returns single accessibility hazard from redis database by given id and language.
 * @group Saavutettavuuden esteet
 * @route GET /saavutettavuudenesteet/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {AccessibilityHazard.model} 200 - Accessibility hazard
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/saavutettavuudenesteet/:key/:lang', getSaavutettavuudenEste);

/**
 * Returns all languages from redis database by given language.
 * @group Kielet
 * @route GET /kielet/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<Language>} 200 - An array of languages
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/kielet/:lang', getKielet);

/**
 * Returns single language from redis database by given id and language.
 * @group Kielet
 * @route GET /kielet/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Language.model} 200 - Language
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/kielet/:key/:lang', getKieli);

/**
 * Returns all educational subjects from redis database by given language.
 * @group Perusopetus
 * @route GET /oppiaineet/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<EducationalSubjectParent>} 200 - An array of educational subjects
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/oppiaineet/:lang', getPerusopetuksenOppiaineet);

/**
 * Returns all educational subject objectives from redis database by given ids and language.
 * @group Perusopetus
 * @route GET /tavoitteet/{ids}/{lang}
 * @param {string} ids.path.required - List of basic study subject ids, separated by comma
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<EducationalSubjectObjective>} 200 - An array of educational subject objectives
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/tavoitteet/:ids/:lang', getPerusopetuksenTavoitteet);

/**
 * Returns all educational subject contents from redis database by given ids and language.
 * @group Perusopetus
 * @route GET /sisaltoalueet/{ids}/{lang}
 * @param {string} ids.path.required - List of basic study subject ids, separated by comma
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<EducationalSubjectContent>} 200 - An array of educational subject contents
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/sisaltoalueet/:ids/:lang', getPerusopetuksenSisaltoalueet);

/**
 * Returns all licenses from redis database by given language.
 * @group Lisenssit
 * @route GET /lisenssit/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<License>} 200 - An array of licenses
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/lisenssit/:lang', getLisenssit);

/**
 * Returns single license from redis database by given id and language.
 * @group Lisenssit
 * @route GET /lisenssit/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {License.model} 200 - License
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/lisenssit/:key/:lang', getLisenssi);

/**
 * Returns all upper secondary school subjects from redis database by given language.
 * @group Lukionkurssit
 * @route GET /lukionkurssit/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<UpperSecondarySchoolSubject>} 200 - An array of upper secondary school subjects
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/lukionkurssit/:lang', getLukionkurssit);

/**
 * Returns single upper secondary school subject from redis database by given id and language.
 * @group Lukionkurssit
 * @route GET /lukionkurssit/{key}/{lang}
 * @param {string} key.path.required - ID
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {UpperSecondarySchoolSubject.model} 200 - Upper secondary school subject
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/lukionkurssit/:key/:lang', getLukionkurssi);

/**
 * Returns all upper secondary school old subjects from redis database by given language.
 * @group Lukio (vanha ops)
 * @route GET /lukio-vanha-oppiaineet/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<UpperSecondarySchoolOldSubject>} 200 - An array of upper secondary school old subjects
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/lukio-vanha-oppiaineet/:lang', getLukionVanhatOppiaineet);

/**
 * Returns all upper secondary school old courses from redis database by given ids and language.
 * @group Lukio (vanha ops)
 * @route GET /lukio-vanha-kurssit/{ids}/{lang}
 * @param {string} ids.path.required - List of upper secondary school subject ids, separated by comma
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<UpperSecondarySchoolOldCourse>} 200 - An array of upper secondary school old courses
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/lukio-vanha-kurssit/:ids/:lang', getLukionVanhatKurssit);

/**
 * Returns all upper secondary school new subjects from redis database by given language.
 * @group Lukio (uusi ops)
 * @route GET /lukio-oppiaineet/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<UpperSecondarySchoolNewSubject>} 200 - An array of upper secondary school new subjects
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/lukio-oppiaineet/:lang', getLukionOppiaineet);

/**
 * Returns all upper secondary school new modules from redis database by given ids and language.
 * @group Lukio (uusi ops)
 * @route GET /lukio-moduulit/{ids}/{lang}
 * @param {string} ids.path.required - List of upper secondary school subject ids, separated by comma
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<UpperSecondarySchoolNewModule>} 200 - An array of upper secondary school new modules
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/lukio-moduulit/:ids/:lang', getLukionModuulit);

/**
 * Returns all upper secondary school new module objectives from redis database by given ids and language.
 * @group Lukio (uusi ops)
 * @route GET /lukio-tavoitteet/{ids}/{lang}
 * @param {string} ids.path.required - List of upper secondary school module ids, separated by comma
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<UpperSecondarySchoolNewModuleObjective>} 200 - An array of upper secondary school new module objectives
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/lukio-tavoitteet/:ids/:lang', getLukionTavoitteet);

/**
 * Returns all upper secondary school new module contents from redis database by given ids and language.
 * @group Lukio (uusi ops)
 * @route GET /lukio-sisallot/{ids}/{lang}
 * @param {string} ids.path.required - List of upper secondary school module ids, separated by comma
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<UpperSecondarySchoolNewModuleContent>} 200 - An array of upper secondary school new module contents
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/lukio-sisallot/:ids/:lang', getLukionSisallot);

/**
 * Returns all vocational qualifications from redis database by given language.
 * @group Ammattikoulu
 * @route GET /ammattikoulu-tutkinnot/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<VocationalQualification>} 200 - An array of vocational qualifications
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/ammattikoulu-tutkinnot/:lang', getAmmattikoulunPerustutkinnot);

/**
 * Returns all vocational qualification units from redis database by given ids and language
 * @group Ammattikoulu
 * @route GET /ammattikoulu-tutkinnon-osat/{ids}/{lang}
 * @param {string} ids.path.required - List of vocational degree ids, separated by comma
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<VocationalQualificationUnit>} 200 - An array of vocational qualification units
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/ammattikoulu-tutkinnon-osat/:ids/:lang', getAmmattikoulunTutkinnonOsat);

/**
 * Returns all vocational qualification unit requirements from redis database by given ids and language.
 * @group Ammattikoulu
 * @route GET /ammattikoulu-vaatimukset/{ids}/{lang}
 * @param {string} ids.path.required - List of vocational unit ids, separated by comma
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<VocationalQualificationUnitRequirement>} 200 - An array of vocational qualification unit requirements
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/ammattikoulu-vaatimukset/:ids/:lang', getAmmattikoulunVaatimukset);

/**
 * Returns all further vocational qualifications from redis database by given language.
 * @group Ammattikoulu
 * @route GET /ammattikoulu-ammattitutkinnot/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<FurtherVocationalQualification>} 200 - An array of further vocational qualifications
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/ammattikoulu-ammattitutkinnot/:lang', getAmmattikoulunAmmattitutkinnot);

/**
 * Returns all specialist vocational qualifications from redis database by given language.
 * @group Ammattikoulu
 * @route GET /ammattikoulu-erikoisammattitutkinnot/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 * @returns {Array.<SpecialistVocationalQualification>} 200 - An array of specialist vocational qualifications
 * @returns {Error.model} 404 - Not found
 * @returns {Error.model} 500 - Something went wrong
 */
router.get('/ammattikoulu-erikoisammattitutkinnot/:lang', getAmmattikoulunErikoisammattitutkinnot);

/**
 * Returns all oppiaineet-tieteenalat-tutkinnot filters from redis database by given language.
 * @group Filtterit
 * @route GET /filters-oppiaineet-tieteenalat-tutkinnot/{lang}
 * @param {string} lang.path.required - ISO 639-1 language code
 */
router.get('/filters-oppiaineet-tieteenalat-tutkinnot/:lang', getOppiaineetTieteenalatTutkinnot);

export default router;
