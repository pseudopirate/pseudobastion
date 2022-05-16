import { pad, prepareBdaysReply, getDayDiff } from '../utils';

describe('utils cases:', () => {
    describe('pad: (str: string) => string', () => {
        it('should add 0', () => {
            expect(pad('1')).toBe('01');
        });

        it('should return same result', () => {
            expect(pad('10')).toBe('10');
        });

        it('should return same result', () => {
            expect(pad('100')).toBe('100');
        });
    });

    const bdayReply = `#birthdays

30 august - <b>mom</b>
13 october - <b>cat</b>`;

    const bdayReplyWithPrefix = `#birthdays
hi there
30 august - <b>mom</b>
13 october - <b>cat</b>`;

    describe('prepareBdaysReply: (bdays: BDay[], prefix: string) => string', () => {
        const bdays = [{ name: 'mom', month: 8, day: 30 }, { name: 'cat', month: 10, day: 13 }];

        it('should return formatted bdays', () => {
            expect(prepareBdaysReply(bdays)).toBe(bdayReply);
        });

        it('should return formatted bdays with prefix', () => {
            expect(prepareBdaysReply(bdays, 'hi there')).toBe(bdayReplyWithPrefix);
        });
    });

    describe('getDayDiff: (today: Date, bday: Date) => number', () => {
        it('should return 3', () => {
            expect(getDayDiff(new Date('06/15/1990'), new Date('06/18/1990'))).toBe(3);
        });

        it('should return 365', () => {
            expect(getDayDiff(new Date('06/15/1990'), new Date('06/15/1991'))).toBe(365);
        });

        it('should return 366', () => {
            expect(getDayDiff(new Date('06/15/2019'), new Date('06/15/2020'))).toBe(366);
        });

        it('should return 1', () => {
            expect(getDayDiff(new Date('12/31/2021'), new Date('01/01/2022'))).toBe(1);
        });
    });
});
