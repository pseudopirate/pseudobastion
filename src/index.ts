import dotenv from 'dotenv';

dotenv.config();
import { bot } from './bot'; // eslint-disable-line import/first

bot.launch();
console.log('Bot started');
