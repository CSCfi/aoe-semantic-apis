import * as redis from 'redis';
import { promisify } from 'util';
// import dotenv from 'dotenv';
// dotenv.config();
import config from '../config';

import { setAsiasanat } from '../controllers/asiasanat';
import { setKoulutusasteet } from '../controllers/koulutusasteet';
import { setKohderyhmat } from '../controllers/kohderyhmat';
import { setKayttokohteet } from '../controllers/kayttokohteet';
import { setSaavutettavuudenTukitoiminnot } from '../controllers/saavutettavuuden-tukitoiminnot';
import { setSaavutettavuudenEsteet } from '../controllers/saavutettavuuden-esteet';
import { setKielet } from '../controllers/kielet';
import { setOrganisaatiot } from '../controllers/organisaatiot';
import { setTieteenalat } from '../controllers/tieteenalat';
import { setOppimateriaalityypit } from '../controllers/oppimateriaalityypit';
import { setPerusopetuksenOppiaineet } from '../controllers/perusopetus';
import { setLisenssit } from '../controllers/lisenssit';
import { setLukionkurssit } from '../controllers/lukionkurssit';
import { setLukionOppiaineetModuulit, setLukionTavoitteetSisallot } from '../controllers/lukio';
import {
    setAmmattikoulunTutkinnonOsat,
    setAmmattikoulunPerustutkinnot,
    setAmmattikoulunAmmattitutkinnot,
    setAmmattikoulunErikoisammattitutkinnot,
} from '../controllers/ammattikoulu';
import { setLukionVanhatOppiaineetKurssit } from '../controllers/vanha-lukio';

export const client = redis.createClient({
    host: config.REDIS_OPTIONS.host || 'not-defined',
    port: +(config.REDIS_OPTIONS.port || 6379),
    password: config.REDIS_OPTIONS.pass || 'not-defined',
});
export const getAsync = promisify(client.get).bind(client);
export const setAsync = promisify(client.set).bind(client);

export async function updateRedis(): Promise<any> {
    await setAsiasanat();
    await setKoulutusasteet();
    await setKohderyhmat();
    await setKayttokohteet();
    await setSaavutettavuudenTukitoiminnot();
    await setSaavutettavuudenEsteet();
    await setKielet();
    await setOrganisaatiot();
    await setTieteenalat();
    await setOppimateriaalityypit();
    await setPerusopetuksenOppiaineet();
    await setLisenssit();
    await setLukionkurssit();
    await setLukionOppiaineetModuulit();
    await setLukionTavoitteetSisallot();
    await setAmmattikoulunPerustutkinnot();
    await setAmmattikoulunAmmattitutkinnot();
    await setAmmattikoulunErikoisammattitutkinnot();
    await setAmmattikoulunTutkinnonOsat();
    await setLukionVanhatOppiaineetKurssit();
}
