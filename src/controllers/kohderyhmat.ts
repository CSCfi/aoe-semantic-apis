import { getDataFromApi } from '../util/api.utils';
import { getAsync, setAsync } from '../util/redis.utils';
import { sortByValue } from '../util/data.utils';
import { KeyValue } from '../models/data';

const endpoint = 'edtech/codeschemes/EducationalRole';
const rediskey = 'kohderyhmat';
const params = 'codes/?format=json';

/**
 * Set data into redis database
 *
 * @returns {Promise<any>}
 */
export async function setKohderyhmat(): Promise<any> {
    try {
        const results = await getDataFromApi(
            process.env.KOODISTOT_SUOMI_URL,
            `/${endpoint}/`,
            { Accept: 'application/json' },
            params,
        );

        const finnish: KeyValue<string, string>[] = [];
        const english: KeyValue<string, string>[] = [];
        const swedish: KeyValue<string, string>[] = [];

        results.results.forEach((result: any) => {
            finnish.push({
                key: result.id,
                value:
                    result.prefLabel.fi !== undefined
                        ? result.prefLabel.fi.trim()
                        : result.prefLabel.sv !== undefined
                        ? result.prefLabel.sv.trim()
                        : result.prefLabel.en.trim(),
            });

            english.push({
                key: result.id,
                value:
                    result.prefLabel.en !== undefined
                        ? result.prefLabel.en.trim()
                        : result.prefLabel.fi !== undefined
                        ? result.prefLabel.fi.trim()
                        : result.prefLabel.sv.trim(),
            });

            swedish.push({
                key: result.id,
                value:
                    result.prefLabel.sv !== undefined
                        ? result.prefLabel.sv.trim()
                        : result.prefLabel.fi !== undefined
                        ? result.prefLabel.fi.trim()
                        : result.prefLabel.en.trim(),
            });
        });

        finnish.sort(sortByValue);
        english.sort(sortByValue);
        swedish.sort(sortByValue);

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
export const getKohderyhmat = async (req: any, res: any, next: any): Promise<any> => {
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
export const getKohderyhma = async (req: any, res: any, next: any): Promise<any> => {
    try {
        const redisData = await getAsync(rediskey);

        if (redisData) {
            const input = JSON.parse(redisData);
            const row = input.find((e: any) => e.key === req.params.key);

            if (row !== undefined) {
                res.status(200).json(row);
            } else {
                res.sendStatus(406);
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
