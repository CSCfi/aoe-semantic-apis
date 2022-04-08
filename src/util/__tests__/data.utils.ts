import { getUnique, sortByOrder, sortByTargetName, sortByValue } from '../data.utils';

describe('Test data utils', () => {
    it('should return unique array based on given property', () => {
        const inputArray = [
            {
                key: 'asd123',
                value: 'Value 1',
            },
            {
                key: 'asd123',
                value: 'Value 2',
            },
            {
                key: 'asd123',
                value: 'Value 3',
            },
            {
                key: 'asd1',
                value: 'Value 4',
            },
        ];

        const expectedOutputArray = [
            {
                key: 'asd123',
                value: 'Value 1',
            },
            {
                key: 'asd1',
                value: 'Value 4',
            },
        ];

        expect(getUnique(inputArray, 'key')).toEqual(expectedOutputArray);
    });

    it('should return alphabetically sorted object array by value property', () => {
        const arrayToBeSorted = [
            { key: 'sv', value: 'Sweden' },
            { key: 'fi', value: 'Finland' },
            { key: 'no', value: 'Norway' },
        ];

        const expectedSortedArray = [
            { key: 'fi', value: 'Finland' },
            { key: 'no', value: 'Norway' },
            { key: 'sv', value: 'Sweden' },
        ];

        expect(arrayToBeSorted.sort(sortByValue)).toEqual(expectedSortedArray);
    });

    it('should return alphabetically sorted object array by targetName property', () => {
        const arrayToBeSorted = [
            { key: 1742261, targetName: 'Logistiikan perustutkinto (Siirtymäajalla)' },
            { key: 3397336, targetName: 'Autoalan perustutkinto' },
            { key: 4038059, targetName: 'Matkailualan perustutkinto' },
        ];

        const expectedSortedArray = [
            { key: 3397336, targetName: 'Autoalan perustutkinto' },
            { key: 1742261, targetName: 'Logistiikan perustutkinto (Siirtymäajalla)' },
            { key: 4038059, targetName: 'Matkailualan perustutkinto' },
        ];

        expect(arrayToBeSorted.sort(sortByTargetName)).toEqual(expectedSortedArray);
    });

    it('should return sorted object array by order property', () => {
        const input = [{ order: 5 }, { order: 1 }, { order: 3 }];

        const expected = [{ order: 1 }, { order: 3 }, { order: 5 }];

        expect(input.sort(sortByOrder)).toEqual(expected);
    });
});
