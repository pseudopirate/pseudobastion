import { Scenes } from 'telegraf';
import * as validate from './validations';
import { putBday } from './db';
import {
    prepareBdaysReply, getChatId, sendError, getDaysCount,
} from '../utils';
import { SCENE_IDS } from '../consts';
import { BDayContext, BDWizardSessionData } from '.';
import { BDay } from '../models';

// Types hack cause telegraf Update.MessageUpdate.message type doesn't have text prop.
// But this prop exsists
const getText = (ctx: BDayContext) => (ctx.update.message as unknown as {text: string}).text;

export const bdaysScene = new Scenes.WizardScene<BDayContext>(
    SCENE_IDS.BDAY_ADD,
    async (ctx) => {
        ctx.editMessageText('Enter name');
        return ctx.wizard.next();
    },
    async (ctx) => {
        const text = getText(ctx);
        if (text === '/cancel') {
            ctx.reply('Aborted');
            return ctx.scene.leave();
        }

        if (validate.name(text)) {
            ctx.reply('Invalid name');
            return undefined;
        }

        (ctx.wizard.state as BDWizardSessionData['state']).name = text;
        ctx.reply('Enter month. It should be a number between 1-12');

        return ctx.wizard.next();
    },
    async (ctx) => {
        const text = getText(ctx);
        if (text === '/cancel') {
            ctx.reply('Aborted');
            return ctx.scene.leave();
        }

        if (validate.month(text)) {
            ctx.reply('Invalid month. It should be a number between 1-12');
            return undefined;
        }

        (ctx.wizard.state as BDWizardSessionData['state']).month = Number(text);
        ctx.reply('Enter day');

        return ctx.wizard.next();
    },
    async (ctx) => {
        const text = getText(ctx);
        if (text === '/cancel') {
            ctx.reply('Aborted');
            return ctx.scene.leave();
        }

        const month = (ctx.wizard.state as BDWizardSessionData['state']).month as number;

        if (validate.day(text, month)) {
            ctx.reply(`Invalid day. It should be a number between 1-${getDaysCount(month)}`);
            return undefined;
        }

        (ctx.wizard.state as BDWizardSessionData['state']).day = Number(text);

        const data = (ctx.wizard.state as BDWizardSessionData['state']) as BDay;
        try {
            await putBday(data, getChatId(ctx));
        } catch (error) {
            sendError((error as Error).message);
            return ctx.reply('Error. Try again or enter /cancel to cancel');
        }

        ctx.reply(prepareBdaysReply([data], 'New birthday added'), { parse_mode: 'HTML' });

        return ctx.scene.leave();
    },
);
