export function getUnique(data: any[], uniqueProperty: string): any[] {
    return data
        .map((e) => e[uniqueProperty])
        .map((e, i, final) => final.indexOf(e) === i && i)
        .filter((e) => data[e])
        .map((e) => data[e]);
}

export const sortByValue = (a: any, b: any) => {
    return a.value.localeCompare(b.value, undefined, { numeric: true, sensitivity: 'accent' });
};

export const sortByTargetName = (a: any, b: any) => {
    return a.targetName.localeCompare(b.targetName, undefined, { numeric: true, sensitivity: 'accent' });
};

export const sortByOrder = (a: any, b: any) => {
    return a.order - b.order;
};
