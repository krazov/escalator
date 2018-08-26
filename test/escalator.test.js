import escalator from '../src/escalator';

describe('escalator', () => {
    it('should return an object with 1 section', () => {
        const actual = escalator({ name: 'test' });
        const expected = {
            data: [
                {
                    value: 0,
                    range: Infinity,
                },
                {
                    name: 'test',
                    value: 0,
                    range: 10,
                }
            ],
        };

        expect(actual).toMatchObject(expected);
    });

    it('should return an object with 2 sections', () => {
        const actual = escalator(
            { name: 'minutes', range: 60 },
            { name: 'seconds', range: 60 },
        );
        const expected = {
            data: [
                {
                    value: 0,
                    range: Infinity,
                },
                {
                    name: 'minutes',
                    value: 0,
                    range: 60,
                },
                {
                    name: 'seconds',
                    value: 0,
                    range: 60,
                },

            ],
        };

        expect(actual).toMatchObject(expected);
    });

    it('should throw an error for repeated names', () => {
        expect(() => {
            escalator({ name: 'test' }, { name: 'test' });
        }).toThrow();
    });

    it('should throw an error for missing name', () => {
        expect(() => {
            escalator({});
        }).toThrow();
    });

    it('should throw an error for empty name', () => {
        expect(() => {
            escalator({ name: '' });
        }).toThrow();
    });

    it('should allow to print value', () => {
        const actual = escalator({ name: 'a', value: 9 }, { name: 'b', value: 7 }).print();
        const expected = '9:7';

        expect(actual).toBe(expected);
    });

    it('should allow to print value', () => {
        const actual = escalator({ name: 'a', value: 9 }, { name: 'b', value: 7 }).printFull();
        const expected = '{ name: a, value: 9, range: 10 }, { name: b, value: 7, range: 10 }';

        expect(actual).toBe(expected);
    });

    it('should allow to set custom separator', () => {
        const actual = escalator({ name: 'a', value: 9 }, { name: 'b', value: 7 }).setSeparator('/').print();
        const expected = '9/7';

        expect(actual).toBe(expected);
    });

    it('should allow to set empty separator', () => {
        const actual = escalator({ name: '10n', value: 9 }, { name: '1n', value: 7 }).setSeparator('').print();
        const expected = '97';

        expect(actual).toBe(expected);
    });

    it('should allow to add default value (non-reaching the range)', () => {
        const actual =
            escalator(
                { name: 'minutes', value: 3, range: 60 },
                { name: 'seconds', value: 14, range: 60 },
            )
                .increase('seconds')
                .print();
        const expected = '3:15';

        expect(actual).toBe(expected);
    });

    it('should allow to add custom value (non-reaching the range)', () => {
        const actual =
            escalator(
                { name: 'minutes', value: 3, range: 60 },
                { name: 'seconds', value: 14, range: 60 },
            )
                .increase('seconds', 2)
                .print();
        const expected = '3:16';

        expect(actual).toBe(expected);
    });

    it('should allow to add custom value (crossing the range, two sections)', () => {
        const actual =
            escalator(
                { name: 'minutes', value: 3, range: 60 },
                { name: 'seconds', value: 59, range: 60 },
            )
                .increase('seconds', 2)
                .print();
        const expected = '4:01';

        expect(actual).toBe(expected);
    });

    it('should allow to add custom value (crossing the range, three sections)', () => {
        const actual =
            escalator(
                { name: 'hours', value: 3, range: 24 },
                { name: 'minutes', value: 3, range: 60 },
                { name: 'seconds', value: 59, range: 60 },
            )
                .setSeparator('/')
                .increase('seconds', 2)
                .print();
        const expected = '3/04/01';

        expect(actual).toBe(expected);
    });

    it('should allow to add big custom value (crossing the range, three sections)', () => {
        const actual =
            escalator(
                { name: 'hours', value: 3, range: 24 },
                { name: 'minutes', value: 3, range: 60 },
                { name: 'seconds', value: 59, range: 60 },
            )
                .increase('seconds', 7200)
                .print();
        const expected = '5:03:59';

        expect(actual).toBe(expected);
    });

    it('should allow to subtract default value (non-reaching the range)', () => {
        const actual =
            escalator(
                { name: 'minutes', value: 3, range: 60 },
                { name: 'seconds', value: 15, range: 60 },
            )
                .decrease('seconds')
                .print();
        const expected = '3:14';

        expect(actual).toBe(expected);
    });

    it('should allow to subtract custom value (non-reaching the range)', () => {
        const actual =
            escalator(
                { name: 'minutes', value: 3, range: 60 },
                { name: 'seconds', value: 16, range: 60 },
            )
                .decrease('seconds', 2)
                .print();
        const expected = '3:14';

        expect(actual).toBe(expected);
    });

    it('should allow to subtract custom value (crossing the range, two sections)', () => {
        const actual =
            escalator(
                { name: 'minutes', value: 4, range: 60 },
                { name: 'seconds', value: 1, range: 60 },
            )
                .decrease('seconds', 2)
                .print();
        const expected = '3:59';

        expect(actual).toBe(expected);
    });

    it('should allow to subtract custom value (crossing the range, three sections)', () => {
        const actual =
            escalator(
                { name: 'hours', value: 3, range: 24 },
                { name: 'minutes', value: 4, range: 60 },
                { name: 'seconds', value: 1, range: 60 },
            )
                .setSeparator('/')
                .decrease('seconds', 2)
                .print();
        const expected = '3/03/59';

        expect(actual).toBe(expected);
    });

    it('should allow to subtract big custom value (crossing the range, three sections)', () => {
        const actual =
            escalator(
                { name: 'hours', value: 3, range: 24 },
                { name: 'minutes', value: 3, range: 60 },
                { name: 'seconds', value: 59, range: 60 },
            )
                .decrease('seconds', 7200)
                .print();
        const expected = '1:03:59';

        expect(actual).toBe(expected);
    });

    it('should allow to create expandable container: increasing (displaying value from extra EXCESS section)', () => {
        const actual =
            escalator(
                { name: 'hours', value: 23, range: 24 },
                { name: 'minutes', value: 59, range: 60 },
                { name: 'seconds', value: 59, range: 60 },
            )
                .setExpandable()
                .increase('seconds', 2)
                .print();
        const expected = '1:00:00:01';

        expect(actual).toBe(expected);
    });

    it('should allow to create expandable container: decreasing (displaying value from extra EXCESS section)', () => {
        const actual =
            escalator(
                { name: 'hours', value: 23, range: 24 },
                { name: 'minutes', value: 59, range: 60 },
                { name: 'seconds', value: 59, range: 60 },
            )
                .setExpandable()
                .increase('seconds', 2)
                .decrease('seconds', 2)
                .print();
        const expected = '23:59:59';

        expect(actual).toBe(expected);
    });

    it('should allow to clone itself', () => {
        const original = escalator({ name: 'Testario' });
        const copy = original.clone();

        expect(copy).toMatchObject(original);
        expect(Object.getPrototypeOf(copy)).toBe(Object.getPrototypeOf(original));
        expect(copy).not.toBe(original);
    });

    it('should allow to get section', () => {
        const object = escalator({ name: 'test1', value: 1 }, { name: 'test2', value: 2 });
        const section1 = object.getSection('test1');
        const section2 = object.getSection('test2');

        expect(section1).toMatchObject({ name: 'test1', value: 1 });
        expect(section2).toMatchObject({ name: 'test2', value: 2 });
    });

    it('should allow to get value of section', () => {
        const object = escalator({ name: 'test1', value: 1 }, { name: 'test2', value: 2 });
        const value1 = object.getValue('test1');
        const value2 = object.getValue('test2');

        expect(value1).toBe(1);
        expect(value2).toBe(2);
    });

    it('should allow to get range of section', () => {
        const object = escalator({ name: 'test1', range: 11 }, { name: 'test2', range: 12 });
        const range1 = object.getRange('test1');
        const range2 = object.getRange('test2');

        expect(range1).toBe(11);
        expect(range2).toBe(12);
    });

    it('should allow to get excess value', () => {
        const object = escalator({ name: 'test1', range: 11 }, { name: 'test2', range: 12 }).increase('test1', 11);
        const excess = object.getExcess();

        expect(excess).toBe(1);
    });

    it('should allow to make object immutable', () => {
        const immutable1 = escalator({ name: 'immutable', value: 1 }).setImmutable();
        const immutable2 = immutable1.increase('immutable');

        const value1 = immutable1.getValue('immutable');
        const value2 = immutable2.getValue('immutable');

        expect(value1).toBe(1);
        expect(value2).toBe(2);
    });

    // it('should allow to add sections')
    // it('should allow to remove sections')
    // it('should allow to get an array with names')
    // it('should allow to get an array with values')
    // it('should allow to get an array with ranges')
    // it('should allow to merge (add) two matching escalators')
    // it('should not allow to go to minus values')
});
