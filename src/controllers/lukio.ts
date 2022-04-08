import { getDataFromApi } from '../util/api.utils';
import { getAsync, setAsync } from '../util/redis.utils';
import { sortByTargetName } from '../util/data.utils';
import { AlignmentObjectExtended } from '../models/alignment-object-extended';

const endpoint = 'perusteet';
const rediskeySubjects = 'lukio-uusi-oppiaineet';
const rediskeyModules = 'lukio-uusi-moduulit';
const rediskeyObjectives = 'lukio-uusi-tavoitteet';
const rediskeyContents = 'lukio-uusi-sisallot';
const params = '6828810/lops2019/oppiaineet';

export async function setLukionOppiaineetModuulit(): Promise<any> {
    try {
        const finnishSubjects: AlignmentObjectExtended[] = [];
        const swedishSubjects: AlignmentObjectExtended[] = [];
        const finnishModules: AlignmentObjectExtended[] = [];
        const swedishModules: AlignmentObjectExtended[] = [];

        const results = await getDataFromApi(
            process.env.EPERUSTEET_SERVICE_URL,
            `/${endpoint}/`,
            {
                Accept: 'application/json',
                'Caller-Id': `${process.env.CALLERID_OID}.${process.env.CALLERID_SERVICE}`,
            },
            params,
        );

        for (const row of results) {
            try {
                const subject = await getDataFromApi(
                    process.env.EPERUSTEET_SERVICE_URL,
                    `/${endpoint}/`,
                    {
                        Accept: 'application/json',
                        'Caller-Id': `${process.env.CALLERID_OID}.${process.env.CALLERID_SERVICE}`,
                    },
                    `${params}/${row.id}`,
                );

                if (subject.moduulit.length > 0) {
                    finnishSubjects.push({
                        key: subject.id,
                        source: 'upperSecondarySchoolSubjectsNew',
                        alignmentType: 'educationalSubject',
                        targetName: subject.nimi.fi ? subject.nimi.fi : subject.nimi.sv,
                        targetUrl: `${process.env.EPERUSTEET_SERVICE_URL}/${endpoint}/${params}/${subject.id}`,
                    });

                    swedishSubjects.push({
                        key: subject.id,
                        source: 'upperSecondarySchoolSubjectsNew',
                        alignmentType: 'educationalSubject',
                        targetName: subject.nimi.sv ? subject.nimi.sv : subject.nimi.fi,
                        targetUrl: `${process.env.EPERUSTEET_SERVICE_URL}/${endpoint}/${params}/${subject.id}`,
                    });

                    for (const module of subject.moduulit) {
                        finnishModules.push({
                            key: module.id,
                            parent: {
                                key: subject.id,
                                value: subject.nimi.fi ? subject.nimi.fi : subject.nimi.sv,
                            },
                            source: 'upperSecondarySchoolModulesNew',
                            alignmentType: 'educationalSubject',
                            targetName: module.nimi.fi ? module.nimi.fi : module.nimi.sv,
                            targetUrl: `${process.env.EPERUSTEET_SERVICE_URL}/${endpoint}/${params}/${subject.id}/moduulit/${module.id}`,
                        });

                        swedishModules.push({
                            key: module.id,
                            parent: {
                                key: subject.id,
                                value: subject.nimi.sv ? subject.nimi.sv : subject.nimi.fi,
                            },
                            source: 'upperSecondarySchoolModulesNew',
                            alignmentType: 'educationalSubject',
                            targetName: module.nimi.sv ? module.nimi.sv : module.nimi.fi,
                            targetUrl: `${process.env.EPERUSTEET_SERVICE_URL}/${endpoint}/${params}/${subject.id}/moduulit/${module.id}`,
                        });
                    }
                }

                if (subject.oppimaarat.length > 0) {
                    for (const row of subject.oppimaarat) {
                        try {
                            const course = await getDataFromApi(
                                process.env.EPERUSTEET_SERVICE_URL,
                                `/${endpoint}/`,
                                {
                                    Accept: 'application/json',
                                    'Caller-Id': `${process.env.CALLERID_OID}.${process.env.CALLERID_SERVICE}`,
                                },
                                `${params}/${row.id}`,
                            );

                            finnishSubjects.push({
                                key: course.id,
                                parent: {
                                    key: subject.id,
                                    value: subject.nimi.fi ? subject.nimi.fi : subject.nimi.sv,
                                },
                                source: 'upperSecondarySchoolSubjectsNew',
                                alignmentType: 'educationalSubject',
                                targetName: course.nimi.fi ? course.nimi.fi : course.nimi.sv,
                                targetUrl: `${process.env.EPERUSTEET_SERVICE_URL}/${endpoint}/${params}/${course.id}`,
                            });

                            swedishSubjects.push({
                                key: course.id,
                                parent: {
                                    key: subject.id,
                                    value: subject.nimi.sv ? subject.nimi.sv : subject.nimi.en,
                                },
                                source: 'upperSecondarySchoolSubjectsNew',
                                alignmentType: 'educationalSubject',
                                targetName: course.nimi.sv ? course.nimi.sv : course.nimi.fi,
                                targetUrl: `${process.env.EPERUSTEET_SERVICE_URL}/${endpoint}/${params}/${course.id}`,
                            });

                            for (const module of course.moduulit) {
                                finnishModules.push({
                                    key: module.id,
                                    parent: {
                                        key: course.id,
                                        value: course.nimi.fi ? course.nimi.fi : course.nimi.sv,
                                    },
                                    source: 'upperSecondarySchoolModulesNew',
                                    alignmentType: 'educationalSubject',
                                    targetName: module.nimi.fi ? module.nimi.fi : module.nimi.sv,
                                    targetUrl: `${process.env.EPERUSTEET_SERVICE_URL}/${endpoint}/${params}/${course.id}/moduulit/${module.id}`,
                                });

                                swedishModules.push({
                                    key: module.id,
                                    parent: {
                                        key: course.id,
                                        value: course.nimi.sv ? course.nimi.sv : course.nimi.fi,
                                    },
                                    source: 'upperSecondarySchoolModulesNew',
                                    alignmentType: 'educationalSubject',
                                    targetName: module.nimi.sv ? module.nimi.sv : module.nimi.fi,
                                    targetUrl: `${process.env.EPERUSTEET_SERVICE_URL}/${endpoint}/${params}/${course.id}/moduulit/${module.id}`,
                                });
                            }
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            } catch (err) {
                console.error(err);
            }
        }

        finnishSubjects.sort(sortByTargetName);
        swedishSubjects.sort(sortByTargetName);

        await setAsync(`${rediskeySubjects}.fi`, JSON.stringify(finnishSubjects));
        await setAsync(`${rediskeySubjects}.sv`, JSON.stringify(swedishSubjects));
        await setAsync(`${rediskeySubjects}.en`, JSON.stringify(finnishSubjects));
        await setAsync(`${rediskeyModules}.fi`, JSON.stringify(finnishModules));
        await setAsync(`${rediskeyModules}.sv`, JSON.stringify(swedishModules));
        await setAsync(`${rediskeyModules}.en`, JSON.stringify(finnishModules));
    } catch (err) {
        console.error(err);
    }
}

export const getLukionOppiaineet = async (req: any, res: any, next: any): Promise<any> => {
    try {
        const data = JSON.parse(await getAsync(`${rediskeySubjects}.${req.params.lang.toLowerCase()}`)).map(
            (subject: AlignmentObjectExtended) => {
                if (subject.parent) {
                    subject.parent = subject.parent.value;
                }

                return subject;
            },
        );

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

export const getLukionModuulit = async (req: any, res: any, next: any): Promise<any> => {
    try {
        const ids = req.params.ids.split(',');

        const data = JSON.parse(await getAsync(`${rediskeyModules}.${req.params.lang.toLowerCase()}`))
            .filter((module: AlignmentObjectExtended) => ids.includes(module.parent.key.toString()))
            .map((module: AlignmentObjectExtended) => {
                module.parent = module.parent.value;

                return module;
            });

        if (data.length > 0) {
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

export async function setLukionTavoitteetSisallot(): Promise<any> {
    try {
        const finnishObjectives: AlignmentObjectExtended[] = [];
        const swedishObjectives: AlignmentObjectExtended[] = [];
        const finnishContents: AlignmentObjectExtended[] = [];
        const swedishContents: AlignmentObjectExtended[] = [];

        const modules = JSON.parse(await getAsync(`${rediskeyModules}.fi`)).map((m: AlignmentObjectExtended) => {
            return {
                id: m.key,
                subjectId: m.parent.key,
            };
        });

        for (const module of modules) {
            try {
                const results = await getDataFromApi(
                    process.env.EPERUSTEET_SERVICE_URL,
                    `/${endpoint}/`,
                    {
                        Accept: 'application/json',
                        'Caller-Id': `${process.env.CALLERID_OID}.${process.env.CALLERID_SERVICE}`,
                    },
                    `${params}/${module.subjectId}/moduulit/${module.id}`,
                );

                results.tavoitteet.tavoitteet?.forEach((objective: any) => {
                    finnishObjectives.push({
                        key: objective._id,
                        parent: {
                            key: results.id,
                            value: results.nimi.fi ? results.nimi.fi : results.nimi.sv,
                        },
                        source: 'upperSecondarySchoolObjectivesNew',
                        alignmentType: 'teaches',
                        targetName: objective.fi ? objective.fi : objective.sv,
                    });

                    swedishObjectives.push({
                        key: objective._id,
                        parent: {
                            key: results.id,
                            value: results.nimi.sv ? results.nimi.sv : results.nimi.fi,
                        },
                        source: 'upperSecondarySchoolObjectivesNew',
                        alignmentType: 'teaches',
                        targetName: objective.sv ? objective.sv : objective.fi,
                    });
                });

                results.sisallot.forEach((contentObject: any) => {
                    contentObject.sisallot?.forEach((content: any) => {
                        finnishContents.push({
                            key: content._id,
                            parent: {
                                key: results.id,
                                value: results.nimi.fi ? results.nimi.fi : results.nimi.sv,
                            },
                            source: 'upperSecondarySchoolContentsNew',
                            alignmentType: 'teaches',
                            targetName: content.fi ? content.fi : content.sv,
                        });

                        swedishContents.push({
                            key: content._id,
                            parent: {
                                key: results.id,
                                value: results.nimi.sv ? results.nimi.sv : results.nimi.fi,
                            },
                            source: 'upperSecondarySchoolContentsNew',
                            alignmentType: 'teaches',
                            targetName: content.sv ? content.sv : content.fi,
                        });
                    });
                });
            } catch (err) {
                console.error(err);
            }
        }

        await setAsync(`${rediskeyObjectives}.fi`, JSON.stringify(finnishObjectives));
        await setAsync(`${rediskeyObjectives}.sv`, JSON.stringify(swedishObjectives));
        await setAsync(`${rediskeyObjectives}.en`, JSON.stringify(finnishObjectives));
        await setAsync(`${rediskeyContents}.fi`, JSON.stringify(finnishContents));
        await setAsync(`${rediskeyContents}.sv`, JSON.stringify(swedishContents));
        await setAsync(`${rediskeyContents}.en`, JSON.stringify(finnishContents));
    } catch (err) {
        console.error(err);
    }
}

export const getLukionTavoitteet = async (req: any, res: any, next: any): Promise<any> => {
    try {
        const ids = req.params.ids.split(',');

        const data = JSON.parse(await getAsync(`${rediskeyObjectives}.${req.params.lang.toLowerCase()}`))
            .filter((objective: AlignmentObjectExtended) => ids.includes(objective.parent.key.toString()))
            .map((objective: AlignmentObjectExtended) => {
                objective.parent = objective.parent.value;

                return objective;
            });

        if (data.length > 0) {
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

export const getLukionSisallot = async (req: any, res: any, next: any): Promise<any> => {
    try {
        const ids = req.params.ids.split(',');

        const data = JSON.parse(await getAsync(`${rediskeyContents}.${req.params.lang.toLowerCase()}`))
            .filter((content: AlignmentObjectExtended) => ids.includes(content.parent.key.toString()))
            .map((content: AlignmentObjectExtended) => {
                content.parent = content.parent.value;

                return content;
            });

        if (data.length > 0) {
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
