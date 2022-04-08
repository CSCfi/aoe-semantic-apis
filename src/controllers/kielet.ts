import { getDataFromApi } from '../util/api.utils';
import { getAsync, setAsync } from '../util/redis.utils';
import { sortByValue } from '../util/data.utils';
import { KeyValue } from '../models/data';

const endpoint = 'kielikoodistoopetushallinto';
const rediskey = 'kielet';
const params = 'koodi';

/**
 * Set data into redis database
 *
 * @returns {Promise<any>}
 */
export async function setKielet(): Promise<any> {
    try {
        const results = await getDataFromApi(
            process.env.KOODISTO_SERVICE_URL,
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

        results.forEach((result: any) => {
            const metadataFi = result.metadata.find((e: any) => e.kieli.toLowerCase() === 'fi');
            const metadataEn = result.metadata.find((e: any) => e.kieli.toLowerCase() === 'en');
            const metadataSv = result.metadata.find((e: any) => e.kieli.toLowerCase() === 'sv');

            finnish.push({
                key: result.koodiArvo.toLowerCase(),
                value:
                    metadataFi !== undefined
                        ? metadataFi.nimi
                        : metadataSv !== undefined
                        ? metadataSv.nimi
                        : metadataEn.nimi,
            });

            english.push({
                key: result.koodiArvo.toLowerCase(),
                value:
                    metadataEn !== undefined
                        ? metadataEn.nimi
                        : metadataFi !== undefined
                        ? metadataFi.nimi
                        : metadataSv.nimi,
            });

            swedish.push({
                key: result.koodiArvo.toLowerCase(),
                value:
                    metadataSv !== undefined
                        ? metadataSv.nimi
                        : metadataFi !== undefined
                        ? metadataFi.nimi
                        : metadataEn.nimi,
            });
        });

        finnish.sort(sortByValue);
        english.sort(sortByValue);
        swedish.sort(sortByValue);

        // move finnish, swedish and english to the front

        // finnish
        let fiIndex = finnish.findIndex((row: any) => row.key.toLowerCase() === 'fi');
        finnish.splice(0, 0, finnish.splice(fiIndex, 1)[0]);

        let svIndex = finnish.findIndex((row: any) => row.key.toLowerCase() === 'sv');
        finnish.splice(1, 0, finnish.splice(svIndex, 1)[0]);

        let enIndex = finnish.findIndex((row: any) => row.key.toLowerCase() === 'en');
        finnish.splice(2, 0, finnish.splice(enIndex, 1)[0]);

        // english
        fiIndex = english.findIndex((row: any) => row.key.toLowerCase() === 'fi');
        english.splice(0, 0, english.splice(fiIndex, 1)[0]);

        svIndex = english.findIndex((row: any) => row.key.toLowerCase() === 'sv');
        english.splice(1, 0, english.splice(svIndex, 1)[0]);

        enIndex = english.findIndex((row: any) => row.key.toLowerCase() === 'en');
        english.splice(2, 0, english.splice(enIndex, 1)[0]);

        // swedish
        fiIndex = swedish.findIndex((row: any) => row.key.toLowerCase() === 'fi');
        swedish.splice(0, 0, swedish.splice(fiIndex, 1)[0]);

        svIndex = swedish.findIndex((row: any) => row.key.toLowerCase() === 'sv');
        swedish.splice(1, 0, swedish.splice(svIndex, 1)[0]);

        enIndex = swedish.findIndex((row: any) => row.key.toLowerCase() === 'en');
        swedish.splice(2, 0, swedish.splice(enIndex, 1)[0]);

        await setAsync(`${rediskey}.fi`, JSON.stringify(finnish));
        await setAsync(`${rediskey}.en`, JSON.stringify(english));
        await setAsync(`${rediskey}.sv`, JSON.stringify(swedish));
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
export const getKielet = async (req: any, res: any, next: any): Promise<any> => {
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
export const getKieli = async (req: any, res: any, next: any): Promise<any> => {
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
