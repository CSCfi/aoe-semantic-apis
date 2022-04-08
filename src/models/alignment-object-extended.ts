export interface AlignmentObjectExtended {
    key?: string | number;
    parent?: any;
    gradeEntity?: number;
    source?: string;
    alignmentType:
        | 'assesses'
        | 'teaches'
        | 'requires'
        | 'textComplexity'
        | 'readingLevel'
        | 'educationalSubject'
        | 'educationalLevel';
    educationalFramework?: string;
    targetDescription?: string;
    targetName: string;
    targetUrl?: string;
    children?: AlignmentObjectExtended[];
}
