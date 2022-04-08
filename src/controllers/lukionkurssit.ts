import { getDataFromApi } from '../util/api.utils';
import { getAsync, setAsync } from '../util/redis.utils';
import { getUnique, sortByTargetName } from '../util/data.utils';
import { AlignmentObjectExtended } from '../models/alignment-object-extended';

const endpoint = 'lukionkurssit';
const rediskey = 'lukionkurssit';
const params = 'koodi';

/**
 * Set data into redis database
 *
 * @returns {Promise<any>}
 */
export async function setLukionkurssit(): Promise<any> {
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

        const finnish: AlignmentObjectExtended[] = [];
        const english: AlignmentObjectExtended[] = [];
        const swedish: AlignmentObjectExtended[] = [];

        results.forEach((row: any) => {
            const metadataFi = row.metadata.find((e: any) => e.kieli.toLowerCase() === 'fi');
            const metadataEn = row.metadata.find((e: any) => e.kieli.toLowerCase() === 'en');
            const metadataSv = row.metadata.find((e: any) => e.kieli.toLowerCase() === 'sv');

            finnish.push({
                key: row.koodiArvo,
                source: 'upperSecondarySchoolSubjects',
                alignmentType: 'educationalSubject',
                targetName: metadataFi
                    ? metadataFi.nimi.trim()
                    : metadataSv
                    ? metadataSv.nimi.trim()
                    : metadataEn.nimi.trim(),
                targetUrl: row.resourceUri,
            });

            english.push({
                key: row.koodiArvo,
                source: 'upperSecondarySchoolSubjects',
                alignmentType: 'educationalSubject',
                targetName: metadataEn
                    ? metadataEn.nimi.trim()
                    : metadataFi
                    ? metadataFi.nimi.trim()
                    : metadataSv.nimi.trim(),
                targetUrl: row.resourceUri,
            });

            swedish.push({
                key: row.koodiArvo,
                source: 'upperSecondarySchoolSubjects',
                alignmentType: 'educationalSubject',
                targetName: metadataSv
                    ? metadataSv.nimi.trim()
                    : metadataFi
                    ? metadataFi.nimi.trim()
                    : metadataEn.nimi.trim(),
                targetUrl: row.resourceUri,
            });
        });

        finnish.sort(sortByTargetName);
        english.sort(sortByTargetName);
        swedish.sort(sortByTargetName);

        const filteredFi = getUnique(finnish, 'targetName');
        const filteredEn = getUnique(english, 'targetName');
        const filteredSv = getUnique(swedish, 'targetName');

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
export const getLukionkurssit = async (req: any, res: any, next: any): Promise<any> => {
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
export const getLukionkurssi = async (req: any, res: any, next: any): Promise<any> => {
    try {
        const redisData = await getAsync(`${rediskey}.${req.params.lang.toLowerCase()}`);

        if (redisData) {
            const input = JSON.parse(redisData);
            const row = input.find((e: any) => e.key.toLowerCase() === req.params.key.toLowerCase());

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
