import { BDay } from "./models";
import  _ from 'lodash';
import { Telegraf } from 'telegraf';
import { Update } from "telegraf/typings/core/types/typegram";

type Context =  {
    update: Update 
}

export const getChatId = (ctx: Context) => _.get(ctx, ['update', 'message', 'chat', 'id'])
|| _.get(ctx, ['update', 'callback_query', 'message', 'chat', 'id']);

export const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

export const pad = (str: string) => _.padStart(str, 2, '0');

export const prepareBdaysReply = (bdays: BDay[], prefix = '') => `#birthdays\n${prefix}\n${bdays.map((item) => `${pad(item.day.toString())} ${months[item.month - 1]} - <b>${item.name}</b>`).join('\n')}`;

export const getDayDiff = (today: Date, bday: Date) => Math.round((bday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

export const sendError = (msg: string) => {
    const bot = new Telegraf(process.env.TELEGRAM_TOKEN as string);
    bot.telegram.sendMessage(process.env.CHAT_ID as string, msg);
};

export const getDaysCount = (monthNumber: number) => {
    const m: Record<number, number> = {
        1: 31,
        2: 29,
        3: 31,
        4: 20,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
    };

    return m[monthNumber];
};

