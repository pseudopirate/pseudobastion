import _ from 'lodash';
import { bot } from '../bot';
import { BDay } from '../models';
import { prepareBdaysReply } from '../utils';

export function sendMessages(bdays: BDay[], title: string) {
    const group = _.groupBy(bdays, 'chat_id');
    const ids = Object.keys(group);

    const promises = ids.map((chatId) => {
        const chatBDays = group[chatId];

        if (chatBDays.length > 0) {
            return bot.telegram.sendMessage(
                chatId,
                prepareBdaysReply(chatBDays, title),
                { parse_mode: 'HTML' },
            );
        }

        return Promise.resolve();
    });

    return Promise.all(promises);
}
