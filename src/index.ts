import dotenv from 'dotenv';

dotenv.config();
import { bot } from './bot'; // eslint-disable-line import/first
import { runCronJobs } from './cron'; // eslint-disable-line import/first

bot.launch();
console.log('Bot started');

runCronJobs();
console.log('Cron jobs started');
