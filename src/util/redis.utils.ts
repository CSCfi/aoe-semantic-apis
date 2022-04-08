import * as redis from 'redis';
import { promisify } from 'util';
import dotenv from 'dotenv';
dotenv.config();

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
    host: process.env.REDIS_HOST || 'not-defined',
    port: +(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASS || 'not-defined',
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
