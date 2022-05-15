import _ from 'lodash';
import { getDaysCount } from '../utils';

export const name = (text: string) => text.length === 0;
export const month = (text: string) => {
    const m = Number(text);

    return !_.isFinite(m) || !(m >= 1 && m <= 12);
};
export const day = (text: string, monthNumber: number) => {
    const d = Number(text);

    const lastDay = getDaysCount(monthNumber);
    return !_.isFinite(d) || !(d >= 1 && d <= lastDay);
};
