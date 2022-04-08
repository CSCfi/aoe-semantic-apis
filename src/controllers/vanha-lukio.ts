import { getDataFromApi } from '../util/api.utils';
import { getAsync, setAsync } from '../util/redis.utils';
import { sortByTargetName } from '../util/data.utils';
import { AlignmentObjectExtended } from '../models/alignment-object-extended';
import { Kurssi, Oppiaine, Oppiainerakenne } from '../models/oppiainerakenne';

const endpoint = 'perusteet';
const rediskeySubjects = 'lukio-vanha-oppiaineet';
const rediskeyCourses = 'lukio-vanha-kurssit';
const params = '1372910/lukiokoulutus/julkinen/oppiainerakenne';

export async function setLukionVanhatOppiaineetKurssit(): Promise<any> {
    try {
        const finnishSubjects: AlignmentObjectExtended[] = [];
        const swedishSubjects: AlignmentObjectExtended[] = [];
        const finnishCourses: AlignmentObjectExtended[] = [];
        const swedishCourses: AlignmentObjectExtended[] = [];

        const results: Oppiainerakenne = await getDataFromApi(
            process.env.EPERUSTEET_SERVICE_URL,
            `/${endpoint}/`,
            {
                Accept: 'application/json',
                'Caller-Id': `${process.env.CALLERID_OID}.${process.env.CALLERID_SERVICE}`,
            },
            params,
        );

        // handle results
        results.oppiaineet.forEach((subject: Oppiaine) => {
            if (subject.oppimaarat.length === 0) {
                finnishSubjects.push({
                    key: subject.koodiArvo,
                    source: 'upperSecondarySchoolSubjectsOld',
                    alignmentType: 'educationalSubject',
                    targetName: subject.nimi.fi ? subject.nimi.fi : subject.nimi.sv,
                });

                swedishSubjects.push({
                    key: subject.koodiArvo,
                    source: 'upperSecondarySchoolSubjectsOld',
                    alignmentType: 'educationalSubject',
                    targetName: subject.nimi.sv ? subject.nimi.sv : subject.nimi.fi,
                });
            }

            // courses
            subject.kurssit?.forEach((course: Kurssi) => {
                finnishCourses.push({
                    key: course.koodiArvo,
                    parent: {
                        key: subject.koodiArvo,
                        value: subject.nimi.fi ? subject.nimi.fi : subject.nimi.sv,
                    },
                    source: 'upperSecondarySchoolCoursesOld',
                    alignmentType: 'educationalSubject',
                    targetName: course.nimi.fi ? course.nimi.fi : course.nimi.sv,
                });

                swedishCourses.push({
                    key: course.koodiArvo,
                    parent: {
                        key: subject.koodiArvo,
                        value: subject.nimi.sv ? subject.nimi.sv : subject.nimi.fi,
                    },
                    source: 'upperSecondarySchoolCoursesOld',
                    alignmentType: 'educationalSubject',
                    targetName: course.nimi.sv ? course.nimi.sv : course.nimi.fi,
                });
            });

            // sub subjects
            subject.oppimaarat?.forEach((subSubject: Oppiaine) => {
                finnishSubjects.push({
                    key: subSubject.koodiArvo,
                    parent: {
                        key: subject.koodiArvo,
                        value: subject.nimi.fi ? subject.nimi.fi : subject.nimi.sv,
                    },
                    source: 'upperSecondarySchoolSubjectsOld',
                    alignmentType: 'educationalSubject',
                    targetName: subSubject.nimi.fi ? subSubject.nimi.fi : subSubject.nimi.sv,
                });

                swedishSubjects.push({
                    key: subSubject.koodiArvo,
                    parent: {
                        key: subject.koodiArvo,
                        value: subject.nimi.sv ? subject.nimi.sv : subject.nimi.fi,
                    },
                    source: 'upperSecondarySchoolSubjectsOld',
                    alignmentType: 'educationalSubject',
                    targetName: subSubject.nimi.sv ? subSubject.nimi.sv : subSubject.nimi.fi,
                });

                // courses
                subSubject.kurssit?.forEach((subCourse: Kurssi) => {
                    finnishCourses.push({
                        key: subCourse.koodiArvo,
                        parent: {
                            key: subSubject.koodiArvo,
                            value: subSubject.nimi.fi ? subSubject.nimi.fi : subSubject.nimi.sv,
                        },
                        source: 'upperSecondarySchoolCoursesOld',
                        alignmentType: 'educationalSubject',
                        targetName: subCourse.nimi.fi ? subCourse.nimi.fi : subCourse.nimi.sv,
                    });

                    swedishCourses.push({
                        key: subCourse.koodiArvo,
                        parent: {
                            key: subSubject.koodiArvo,
                            value: subSubject.nimi.sv ? subSubject.nimi.sv : subSubject.nimi.fi,
                        },
                        source: 'upperSecondarySchoolCoursesOld',
                        alignmentType: 'educationalSubject',
                        targetName: subCourse.nimi.sv ? subCourse.nimi.sv : subCourse.nimi.fi,
                    });
                });
            });
        });

        finnishSubjects.sort(sortByTargetName);
        swedishSubjects.sort(sortByTargetName);
        finnishCourses.sort(sortByTargetName);
        swedishCourses.sort(sortByTargetName);

        await setAsync(`${rediskeySubjects}.fi`, JSON.stringify(finnishSubjects));
        await setAsync(`${rediskeySubjects}.sv`, JSON.stringify(swedishSubjects));
        await setAsync(`${rediskeySubjects}.en`, JSON.stringify(finnishSubjects));
        await setAsync(`${rediskeyCourses}.fi`, JSON.stringify(finnishCourses));
        await setAsync(`${rediskeyCourses}.sv`, JSON.stringify(swedishCourses));
        await setAsync(`${rediskeyCourses}.en`, JSON.stringify(finnishCourses));
    } catch (error) {
        console.error(error);
    }
}

export const getLukionVanhatOppiaineet = async (req: any, res: any, next: any): Promise<any> => {
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const getLukionVanhatKurssit = async (req: any, res: any, next: any): Promise<any> => {
    try {
        const ids = req.params.ids.split(',');

        const data = JSON.parse(await getAsync(`${rediskeyCourses}.${req.params.lang.toLowerCase()}`))
            .filter((course: AlignmentObjectExtended) => ids.includes(course.parent.key.toString()))
            .map((course: AlignmentObjectExtended) => {
                course.parent = course.parent.value;

                return course;
            });

        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ error: 'Not Found' });

            return next();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
