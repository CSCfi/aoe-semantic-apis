import { parseString, processors } from 'xml2js';

import { getDataFromApi } from '../util/api.utils';
import { getAsync, setAsync } from '../util/redis.utils';
import { sortByValue } from '../util/data.utils';
import { KeyValue } from '../models/data';

const endpoint = 'yso';
const rediskey = 'asiasanat';
const params = 'data';

/**
 * Set data into redis database
 *
 * @returns {Promise<any>}
 */
export async function setAsiasanat(): Promise<any> {
    try {
        const results = await getDataFromApi(
            process.env.FINTO_URL || 'not-defined',
            `/${endpoint}/`,
            { Accept: 'application/rdf+xml' },
            params,
        );

        const finnish: KeyValue<string, string>[] = [];
        const english: KeyValue<string, string>[] = [];
        const swedish: KeyValue<string, string>[] = [];

        const parseOptions = {
            tagNameProcessors: [processors.stripPrefix],
            attrNameProcessors: [processors.stripPrefix],
            valueProcessors: [processors.stripPrefix],
            attrValueProcessors: [processors.stripPrefix],
        };

        parseString(results, parseOptions, async (err, result) => {
            if (err) {
                console.error(err);
            }

            try {
                result.RDF.Concept.forEach((concept: any) => {
                    // const key = concept.$.about.substring(concept.$.about.lastIndexOf("/") + 1, concept.$.about.length);
                    const key = concept.$.about;
                    const labelFi = concept.prefLabel.find((e: any) => e.$.lang === 'fi');
                    const labelEn = concept.prefLabel.find((e: any) => e.$.lang === 'en');
                    const labelSv = concept.prefLabel.find((e: any) => e.$.lang === 'sv');

                    finnish.push({
                        key: key,
                        value: labelFi !== undefined ? labelFi._ : labelSv !== undefined ? labelSv._ : labelEn._,
                    });

                    english.push({
                        key: key,
                        value: labelEn !== undefined ? labelEn._ : labelFi !== undefined ? labelFi._ : labelSv._,
                    });

                    swedish.push({
                        key: key,
                        value: labelSv !== undefined ? labelSv._ : labelFi !== undefined ? labelFi._ : labelEn._,
                    });
                });
            } catch (error) {
                console.error(error);
            }
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
export const getAsiasanat = async (req: any, res: any, next: any): Promise<any> => {
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
export const getAsiasana = async (req: any, res: any, next: any): Promise<any> => {
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
