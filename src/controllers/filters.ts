import { getAsync } from '../util/redis.utils';
import { AlignmentObjectExtended } from '../models/alignment-object-extended';
import { FilterOption, FilterOptionChild } from '../models/filter-option';

const rediskeyBasic = 'oppiaineet';
const rediskeyUpperSecondary = 'lukio-uusi-oppiaineet';
const rediskeyVocational = 'ammattikoulu-tutkinnot';
const rediskeyHigher = 'tieteenalat';

export const getOppiaineetTieteenalatTutkinnot = async (req: any, res: any, next: any): Promise<any> => {
    try {
        const data: FilterOption[] = [
            await getPerusopetuksenOppiaineet(req.params.lang.toLowerCase()),
            await getLukionOppiaineet(req.params.lang.toLowerCase()),
            await getAmmattikoulunTutkinnot(req.params.lang.toLowerCase()),
            await getTieteenalat(req.params.lang.toLowerCase()),
        ];

        if (data) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Not Found' });

            return next();
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

async function getPerusopetuksenOppiaineet(lang: string) {
    try {
        const subjects = JSON.parse(await getAsync(`${rediskeyBasic}.${lang}`));

        if (subjects) {
            const children: FilterOptionChild[] = [];
            const titles: any = {
                fi: 'Perusopetus',
                sv: 'Grundläggande utbildning',
                en: 'Basic education',
            };

            subjects.forEach((subject: AlignmentObjectExtended) => {
                if (subject.children) {
                    subject.children.forEach((child: AlignmentObjectExtended) => {
                        children.push({
                            key: child.key,
                            value: child.targetName,
                            parent: subject.targetName,
                        });
                    });
                }
            });

            return {
                key: '8cb1a02f-54cb-499a-b470-4ee980519707',
                value: titles[lang],
                children: children,
            };
        }
    } catch (err) {
        console.error(err);
    }
}

async function getLukionOppiaineet(lang: string) {
    try {
        const subjects = JSON.parse(await getAsync(`${rediskeyUpperSecondary}.${lang}`));

        if (subjects) {
            const titles: any = {
                fi: 'Lukiokoulutus',
                sv: 'Gymnasieutbildning',
                en: 'Upper secondary school',
            };

            const children: FilterOptionChild[] = subjects.map((subject: AlignmentObjectExtended) => {
                return {
                    key: subject.key,
                    value: subject.targetName,
                    parent: subject.parent?.value,
                };
            });

            return {
                key: '94f79e1e-10e6-483d-b651-27521f94f7bf',
                value: titles[lang],
                children: children,
            };
        }
    } catch (err) {
        console.error(err);
    }
}

async function getAmmattikoulunTutkinnot(lang: string) {
    try {
        const degrees = JSON.parse(await getAsync(`${rediskeyVocational}.${lang}`));

        if (degrees) {
            const titles: any = {
                fi: 'Ammatillinen koulutus',
                sv: 'Yrkesutbildning',
                en: 'Vocational education',
            };

            const children: FilterOptionChild[] = degrees.map((degree: AlignmentObjectExtended) => {
                return {
                    key: degree.key,
                    value: degree.targetName,
                };
            });

            return {
                key: '010c6689-5021-4d8e-8c02-68a27cc5a87b',
                value: titles[lang],
                children: children,
            };
        }
    } catch (err) {
        console.error(err);
    }
}

async function getTieteenalat(lang: string) {
    try {
        const branches = JSON.parse(await getAsync(`${rediskeyHigher}.${lang}`));

        if (branches) {
            const children: FilterOptionChild[] = [];
            const titles: any = {
                fi: 'Korkeakoulutus',
                sv: 'Högskoleutbildning',
                en: 'Higher education',
            };

            branches.forEach((branch: AlignmentObjectExtended) => {
                if (branch.children) {
                    branch.children.forEach((child: AlignmentObjectExtended) => {
                        children.push({
                            key: child.key,
                            value: child.targetName,
                            parent: branch.targetName,
                        });
                    });
                }
            });

            return {
                key: 'e5a48ada-3de0-4246-9b8f-32d4ff68e22f',
                value: titles[lang],
                children: children,
            };
        }
    } catch (err) {
        console.error(err);
    }
}
