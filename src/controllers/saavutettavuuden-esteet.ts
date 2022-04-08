import { getDataFromApi } from '../util/api.utils';
import { getAsync, setAsync } from '../util/redis.utils';
import { sortByOrder } from '../util/data.utils';
import { Accessibility } from '../models/data';

const endpoint = 'edtech/codeschemes/SaavutettavuusEsteet';
const rediskey = 'saavutettavuudenesteet';
const params = 'codes/?format=json';

/**
 * Set data into redis database
 *
 * @returns {Promise<any>}
 */
export async function setSaavutettavuudenEsteet(): Promise<any> {
    try {
        const results = await getDataFromApi(
            process.env.KOODISTOT_SUOMI_URL,
            `/${endpoint}/`,
            { Accept: 'application/json' },
            params,
        );

        const finnish: Accessibility[] = [];
        const english: Accessibility[] = [];
        const swedish: Accessibility[] = [];

        results.results.forEach((result: any) => {
            finnish.push({
                key: result.id,
                value:
                    result.prefLabel.fi !== undefined
                        ? result.prefLabel.fi
                        : result.prefLabel.sv !== undefined
                        ? result.prefLabel.sv
                        : result.prefLabel.en,
                description:
                    result.description?.fi !== undefined
                        ? result.description?.fi
                        : result.description?.sv !== undefined
                        ? result.description?.sv
                        : result.description?.en,
                order: result.order,
            });

            english.push({
                key: result.id,
                value:
                    result.prefLabel.en !== undefined
                        ? result.prefLabel.en
                        : result.prefLabel.fi !== undefined
                        ? result.prefLabel.fi
                        : result.prefLabel.sv,
                description:
                    result.description?.en !== undefined
                        ? result.description?.en
                        : result.description?.fi !== undefined
                        ? result.description?.fi
                        : result.description?.sv,
                order: result.order,
            });

            swedish.push({
                key: result.id,
                value:
                    result.prefLabel.sv !== undefined
                        ? result.prefLabel.sv
                        : result.prefLabel.fi !== undefined
                        ? result.prefLabel.fi
                        : result.prefLabel.en,
                description:
                    result.description?.sv !== undefined
                        ? result.description?.sv
                        : result.description?.fi !== undefined
                        ? result.description?.fi
                        : result.description?.en,
                order: result.order,
            });
        });

        finnish.sort(sortByOrder);
        english.sort(sortByOrder);
        swedish.sort(sortByOrder);

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
export const getSaavutettavuudenEsteet = async (req: any, res: any, next: any): Promise<any> => {
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
export const getSaavutettavuudenEste = async (req: any, res: any, next: any): Promise<any> => {
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
