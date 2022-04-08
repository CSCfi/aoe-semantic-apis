import { getDataFromApi } from '../util/api.utils';
import { getAsync, setAsync } from '../util/redis.utils';
import { getUnique, sortByValue } from '../util/data.utils';
import { KeyValue } from '../models/data';

const endpoint = 'organisaatio/v4';
const rediskey = 'organisaatiot';
const params = 'hae?aktiiviset=true&suunnitellut=false&lakkautetut=false';

/**
 * Set data into redis database
 *
 * @returns {Promise<any>}
 */
export async function setOrganisaatiot(): Promise<any> {
    try {
        const results = await getDataFromApi(
            process.env.ORGANISAATIO_SERVICE_URL || 'not-defined',
            `/${endpoint}/`,
            {
                Accept: 'application/json',
                'Caller-Id': `${process.env.CALLERID_OID}.${process.env.CALLERID_SERVICE}`,
            },
            params,
        );

        const finnish: KeyValue<string, string>[] = [];
        const english: KeyValue<string, string>[] = [];
        const swedish: KeyValue<string, string>[] = [];

        results.organisaatiot.forEach((organisation: any) => {
            finnish.push({
                key: organisation.oid,
                value:
                    organisation.nimi.fi !== undefined
                        ? organisation.nimi.fi
                        : organisation.nimi.sv !== undefined
                        ? organisation.nimi.sv
                        : organisation.nimi.en,
            });

            english.push({
                key: organisation.oid,
                value:
                    organisation.nimi.en !== undefined
                        ? organisation.nimi.en
                        : organisation.nimi.fi !== undefined
                        ? organisation.nimi.fi
                        : organisation.nimi.sv,
            });

            swedish.push({
                key: organisation.oid,
                value:
                    organisation.nimi.sv !== undefined
                        ? organisation.nimi.sv
                        : organisation.nimi.fi !== undefined
                        ? organisation.nimi.fi
                        : organisation.nimi.en,
            });
        });

        finnish.sort(sortByValue);
        english.sort(sortByValue);
        swedish.sort(sortByValue);

        const filteredFi = getUnique(finnish, 'value');
        const filteredEn = getUnique(english, 'value');
        const filteredSv = getUnique(swedish, 'value');

        await setAsync(`${rediskey}.fi`, JSON.stringify(filteredFi));
        await setAsync(`${rediskey}.en`, JSON.stringify(filteredEn));
        await setAsync(`${rediskey}.sv`, JSON.stringify(filteredSv));
    } catch (err) {
        console.error(err);
    }
}

/**
 * Get data from redis database
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 *
 * @returns {Promise<any>}
 */
export const getOrganisaatiot = async (req: any, res: any, next: any): Promise<any> => {
    try {
        const redisData = await getAsync(`${rediskey}.${req.params.lang.toLowerCase()}`);

        if (redisData) {
            res.status(200).json(JSON.parse(redisData));
        } else {
            res.status(404).json({ error: 'Not Found' });

            return next();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

/**
 * Get single row from redis database key-value
 *
 * @param {any} req
 * @param {any} res
 * @param {any} next
 *
 * @returns {Promise<any>}
 */
export const getOrganisaatio = async (req: any, res: any, next: any): Promise<any> => {
    try {
        const redisData = await getAsync(`${rediskey}.${req.params.lang.toLowerCase()}`);

        if (redisData) {
            const input = JSON.parse(redisData);
            const row = input.find((e: any) => e.key === req.params.key);

            if (row !== undefined) {
                res.status(200).json(row);
            } else {
                res.status(404).json({ error: 'Not Found' });
            }
        } else {
            res.status(404).json({ error: 'Not Found' });

            return next();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
