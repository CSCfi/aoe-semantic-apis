import { getDataFromApi } from '../util/api.utils';
import { getAsync, setAsync } from '../util/redis.utils';
import { Children, EducationLevel } from '../models/data';
import { sortByValue } from '../util/data.utils';

const endpoint = 'edtech/codeschemes/Koulutusaste';
const rediskey = 'koulutusasteet';
const params = 'codes/?format=json';

/**
 * Set data into redis database
 *
 * @returns {Promise<any>}
 */
export async function setKoulutusasteet(): Promise<any> {
    try {
        const results = await getDataFromApi(
            process.env.KOODISTOT_SUOMI_URL,
            `/${endpoint}/`,
            { Accept: 'application/json' },
            params,
        );

        const finnish: EducationLevel[] = [];
        const english: EducationLevel[] = [];
        const swedish: EducationLevel[] = [];

        const data = results.results.map((result: any) => {
            return {
                key: result.id,
                parent: 'broaderCode' in result ? result.broaderCode.id : undefined,
                value: {
                    fi: result.prefLabel.fi,
                    en: result.prefLabel.en,
                    sv: result.prefLabel.sv,
                },
            };
        });

        data.forEach((row: any) => {
            const childrenArray = data.filter((e: any) => e.parent === row.key);
            const childrenFi: Children[] = [];
            const childrenEn: Children[] = [];
            const childrenSv: Children[] = [];

            childrenFi.push({
                key: row.key,
                value:
                    row.value.fi !== undefined
                        ? row.value.fi
                        : row.value.sv !== undefined
                        ? row.value.sv
                        : row.value.en,
            });

            childrenEn.push({
                key: row.key,
                value:
                    row.value.en !== undefined
                        ? row.value.en
                        : row.value.fi !== undefined
                        ? row.value.fi
                        : row.value.sv,
            });

            childrenSv.push({
                key: row.key,
                value:
                    row.value.sv !== undefined
                        ? row.value.sv
                        : row.value.fi !== undefined
                        ? row.value.fi
                        : row.value.en,
            });

            childrenArray.forEach((child: any) => {
                childrenFi.push({
                    key: child.key,
                    value:
                        child.value.fi !== undefined
                            ? child.value.fi
                            : child.value.sv !== undefined
                            ? child.value.sv
                            : child.value.en,
                });

                childrenEn.push({
                    key: child.key,
                    value:
                        child.value.en !== undefined
                            ? child.value.en
                            : child.value.fi !== undefined
                            ? child.value.fi
                            : child.value.sv,
                });

                childrenSv.push({
                    key: child.key,
                    value:
                        child.value.sv !== undefined
                            ? child.value.sv
                            : child.value.fi !== undefined
                            ? child.value.fi
                            : child.value.en,
                });
            });

            // basic education
            if (row.key === '8cb1a02f-54cb-499a-b470-4ee980519707') {
                // sort sub levels by value
                childrenFi.sort(sortByValue);
                childrenEn.sort(sortByValue);
                childrenSv.sort(sortByValue);

                // we need to do some manual sorting to get main level first and 10th grade to last
                const mainLevelIndex = childrenFi.findIndex(
                    (level: Children) => level.key === '8cb1a02f-54cb-499a-b470-4ee980519707',
                );
                childrenFi.splice(0, 0, childrenFi.splice(mainLevelIndex, 1)[0]);

                const lastLevelIndex = childrenFi.findIndex(
                    (level: Children) => level.key === '14fe3b08-8516-4999-946b-96eb90c2d563',
                );
                childrenFi.splice(childrenFi.length - 1, 0, childrenFi.splice(lastLevelIndex, 1)[0]);
            }

            if (row.parent === undefined) {
                finnish.push({
                    key: row.key,
                    value:
                        row.value.fi !== undefined
                            ? row.value.fi
                            : row.value.sv !== undefined
                            ? row.value.sv
                            : row.value.en,
                    children: childrenFi,
                });

                english.push({
                    key: row.key,
                    value:
                        row.value.en !== undefined
                            ? row.value.en
                            : row.value.fi !== undefined
                            ? row.value.fi
                            : row.value.sv,
                    children: childrenEn,
                });

                swedish.push({
                    key: row.key,
                    value:
                        row.value.sv !== undefined
                            ? row.value.sv
                            : row.value.fi !== undefined
                            ? row.value.fi
                            : row.value.en,
                    children: childrenSv,
                });
            }
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
export const getKoulutusasteet = async (req: any, res: any, next: any): Promise<any> => {
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
export const getKoulutusaste = async (req: any, res: any, next: any): Promise<any> => {
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
