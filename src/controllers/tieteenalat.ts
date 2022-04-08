import { getDataFromApi } from '../util/api.utils';
import { getAsync, setAsync } from '../util/redis.utils';
import { AlignmentObjectExtended } from '../models/alignment-object-extended';

const endpoint = 'tieteenala';
const rediskey = 'tieteenalat';
const params = 'koodi';

/**
 * Set data into redis database
 *
 * @returns {Promise<any>}
 */
export async function setTieteenalat(): Promise<any> {
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

        const finnishBranches: AlignmentObjectExtended[] = [
            {
                key: '1',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Luonnontieteet',
                children: [],
            },
            {
                key: '2',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Tekniikka',
                children: [],
            },
            {
                key: '3',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Lääke- ja terveystieteet',
                children: [],
            },
            {
                key: '4',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Maatalous- ja metsätieteet',
                children: [],
            },
            {
                key: '5',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Yhteiskuntatieteet',
                children: [],
            },
            {
                key: '6',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Humanistiset tieteet',
                children: [],
            },
        ];

        const englishBranches: AlignmentObjectExtended[] = [
            {
                key: '1',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Natural sciences',
                children: [],
            },
            {
                key: '2',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Engineering and technology',
                children: [],
            },
            {
                key: '3',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Medical and health sciences',
                children: [],
            },
            {
                key: '4',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Agriculture and forestry',
                children: [],
            },
            {
                key: '5',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Social sciences',
                children: [],
            },
            {
                key: '6',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Humanities',
                children: [],
            },
        ];

        const swedishBranches: AlignmentObjectExtended[] = [
            {
                key: '1',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Naturvetenskaper',
                children: [],
            },
            {
                key: '2',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Teknik',
                children: [],
            },
            {
                key: '3',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Medicin och hälsovetenskaper',
                children: [],
            },
            {
                key: '4',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Jordbruks- och skogsvetenskaper',
                children: [],
            },
            {
                key: '5',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Samhällsvetenskaper',
                children: [],
            },
            {
                key: '6',
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: 'Humanistiska vetenskaper',
                children: [],
            },
        ];

        results.forEach((result: any) => {
            const metadataFi = result.metadata.find((e: any) => e.kieli.toLowerCase() === 'fi');

            const parentFi = finnishBranches.find((e: any) => e.key === result.koodiArvo.charAt(0));

            parentFi.children.push({
                key: result.koodiArvo,
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: metadataFi.nimi.trim(),
                targetUrl: result.resourceUri,
            });

            const metadataEn = result.metadata.find((e: any) => e.kieli.toLowerCase() === 'en');

            const parentEn = englishBranches.find((e: any) => e.key === result.koodiArvo.charAt(0));

            parentEn.children.push({
                key: result.koodiArvo,
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: metadataEn.nimi.trim(),
                targetUrl: result.resourceUri,
            });

            const metadataSv = result.metadata.find((e: any) => e.kieli.toLowerCase() === 'sv');

            const parentSv = swedishBranches.find((e: any) => e.key === result.koodiArvo.charAt(0));

            parentSv.children.push({
                key: result.koodiArvo,
                source: 'branchesOfScience',
                alignmentType: 'educationalSubject',
                targetName: metadataSv.nimi.trim(),
                targetUrl: result.resourceUri,
            });
        });

        finnishBranches.sort((a: any, b: any) => a.key - b.key);
        englishBranches.sort((a: any, b: any) => a.key - b.key);
        swedishBranches.sort((a: any, b: any) => a.key - b.key);

        finnishBranches.forEach((parent: any) => {
            parent.children.sort((a: any, b: any) => a.key - b.key);
        });

        englishBranches.forEach((parent: any) => {
            parent.children.sort((a: any, b: any) => a.key - b.key);
        });

        swedishBranches.forEach((parent: any) => {
            parent.children.sort((a: any, b: any) => a.key - b.key);
        });

        await setAsync(`${rediskey}.fi`, JSON.stringify(finnishBranches));
        await setAsync(`${rediskey}.en`, JSON.stringify(englishBranches));
        await setAsync(`${rediskey}.sv`, JSON.stringify(swedishBranches));
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
export const getTieteenalat = async (req: any, res: any, next: any): Promise<any> => {
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
