import {
    spawn,
    separate,
    pad,
    isMultiple10,
} from '../src/utils';

describe('spawn', () => {
    it('should spawn an empty object without any params', () => {
        const actual = spawn();
        const expected = {
            name: '',
            value: 0,
            range: 10,
        };

        expect(actual).toMatchObject(expected);
    });

    it('should spawn an object with name', () => {
        const actual = spawn({ name: 'Geoffrey' });
        const expected = {
            name: 'Geoffrey',
            value: 0,
            range: 10,
        };

        expect(actual).toMatchObject(expected);
    });

    it('should spawn an object with with name and value', () => {
        const actual = spawn({ name: 'Geoffrey', value: 6 });
        const expected = {
            name: 'Geoffrey',
            value: 6,
            range: 10,
        };

        expect(actual).toMatchObject(expected);
    });

});

describe('separate', () => {
    it('should serve empty string for index 0', () => {
        const actual = separate(0, ':');
        const expected = '';

        expect(actual).toBe(expected);
    });

    it('should serve passed separator string for index other than 0', () => {
        const actual = separate(1, ':');
        const expected = ':';

        expect(actual).toBe(expected);
    });
});

describe('pad', () => {
    it('should pad `value` to length of `range', () => {
        const actual = pad(9, 10);
        const expected = '9';

        expect(actual).toBe(expected);
    });
});

describe('isMultiple10', () => {
    it('should recognize multiplicity of 10', () => {
        expect(isMultiple10(10)).toBe(true);
        expect(isMultiple10(100)).toBe(true);
        expect(isMultiple10(1000)).toBe(true);
        expect(isMultiple10(10000)).toBe(true);
    });

    it('should recognize multiplicity of 10', () => {
        expect(isMultiple10(11)).toBe(false);
        expect(isMultiple10(101)).toBe(false);
        expect(isMultiple10(1020)).toBe(false);
        expect(isMultiple10(10300)).toBe(false);
    });
});
