import {
    Telegraf, session, Scenes, Context,
} from 'telegraf';
import AWS from 'aws-sdk';
import { telegrafThrottler } from 'telegraf-throttler';
import _ from 'lodash';
import { Update } from 'telegraf/src/core/types/typegram';
import { getChatId, prepareBdaysReply } from '../utils';
import { bdaysScene } from './scenes';
import { bdaysKeyboard, BDAYS_ACTIONS, commandDescriptions } from './consts';
import { SCENE_IDS } from '../consts';
import { BDay } from '../models';

AWS.config.update({
    region: process.env.AWS_REGION,
    // @ts-ignore
    endpoint: process.env.DB_ENDPOINT,
});

export interface BDWizardSessionData extends Scenes.WizardSessionData {
    state: Partial<BDay>;
}

export interface BDayContext extends Context {
    update: Update.MessageUpdate;

    // declare scene type
    scene: Scenes.SceneContextScene<BDayContext, BDWizardSessionData>
    // declare wizard type
    wizard: Scenes.WizardContextWizard<BDayContext>
}

export const bot = new Telegraf<BDayContext>(process.env.TELEGRAM_TOKEN as string);

const stage = new Scenes.Stage<BDayContext>([bdaysScene]);
const throttler = telegrafThrottler();

bot.use(throttler);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => ctx.reply('Hey! Send me /help if you want to know what I can do'));
bot.command('help', (ctx) => ctx.reply(commandDescriptions.join('\n')));
bot.command('birthdays', (ctx) => {
    ctx.reply('What do you wanna do?', bdaysKeyboard);
});
bot.command('bdays', (ctx) => {
    ctx.reply('What do you wanna do?', bdaysKeyboard);
});

bot.action(BDAYS_ACTIONS.List, async (ctx) => {
    const chatId = getChatId(ctx);
    const client = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: 'birthdays',
        KeyConditionExpression: 'chat_id = :cid',
        ExpressionAttributeValues: {
            ':cid': chatId,
        },
    };
    const { Items } = await client.query(params).promise();

    const bdays = _.orderBy(Items as BDay[], ['month', 'day']);

    return ctx.editMessageText(prepareBdaysReply(bdays), { parse_mode: 'HTML' });
});

bot.action(BDAYS_ACTIONS.Add, (ctx) => {
    ctx.answerCbQuery();
    return ctx.scene.enter(SCENE_IDS.BDAY_ADD);
});

bot.on('text', (ctx) => ctx.reply('Send me /help to get available commands'));
