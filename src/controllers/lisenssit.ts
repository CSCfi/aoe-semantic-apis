import { getDataFromApi } from '../util/api.utils';
import { getAsync, setAsync } from '../util/redis.utils';
import { License } from '../models/data';

const endpoint = 'edtech/codeschemes/Licence';
const rediskey = 'lisenssit';
const params = 'codes/?format=json&expand=externalReference';

/**
 * Set data into redis database
 *
 * @returns {Promise<any>}
 */
export async function setLisenssit(): Promise<any> {
    try {
        const results = await getDataFromApi(
            process.env.KOODISTOT_SUOMI_URL,
            `/${endpoint}/`,
            { Accept: 'application/json' },
            params,
        );

        const finnish: License[] = [];
        const english: License[] = [];
        const swedish: License[] = [];

        results.results.forEach((result: any) => {
            finnish.push({
                key: result.codeValue,
                value:
                    result.prefLabel.fi !== undefined
                        ? result.prefLabel.fi
                        : result.prefLabel.sv !== undefined
                        ? result.prefLabel.sv
                        : result.prefLabel.en,
                link: result.externalReferences[0].href,
                description:
                    result.definition.fi !== undefined
                        ? result.definition.fi
                        : result.definition.sv !== undefined
                        ? result.definition.sv
                        : result.definition.en,
            });

            english.push({
                key: result.codeValue,
                value:
                    result.prefLabel.en !== undefined
                        ? result.prefLabel.en
                        : result.prefLabel.fi !== undefined
                        ? result.prefLabel.fi
                        : result.prefLabel.sv,
                link: result.externalReferences[0].href,
                description:
                    result.definition.en !== undefined
                        ? result.definition.en
                        : result.definition.fi !== undefined
                        ? result.definition.fi
                        : result.definition.sv,
            });

            swedish.push({
                key: result.codeValue,
                value:
                    result.prefLabel.sv !== undefined
                        ? result.prefLabel.sv
                        : result.prefLabel.fi !== undefined
                        ? result.prefLabel.fi
                        : result.prefLabel.en,
                link: result.externalReferences[0].href,
                description:
                    result.definition.sv !== undefined
                        ? result.definition.sv
                        : result.definition.fi !== undefined
                        ? result.definition.fi
                        : result.definition.en,
            });
        });

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
export const getLisenssit = async (req: any, res: any, next: any): Promise<any> => {
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
export const getLisenssi = async (req: any, res: any, next: any): Promise<any> => {
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
