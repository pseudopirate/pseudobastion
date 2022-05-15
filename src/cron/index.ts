import cron from 'node-cron';
import everyday from './everyday';
import everyweek from './everyweek';
import everymonth from './everymonth';

export function runCronJobs() {
    cron.schedule('0 8 * * *', everyday);
    cron.schedule('0 8 * * 1', everyweek);
    cron.schedule('0 8 1 * *', everymonth);
}
