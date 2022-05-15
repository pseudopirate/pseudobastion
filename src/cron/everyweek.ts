import AWS from 'aws-sdk';

import _ from 'lodash';
import { bot } from '../bot';
import { BDay } from '../models';
import { prepareBdaysReply, getDayDiff, pad } from '../utils';

AWS.config.update({
    region: process.env.AWS_REGION,
    // @ts-ignore
    endpoint: process.env.DB_ENDPOINT,
});

const everyweek = async () => {
    const client = new AWS.DynamoDB.DocumentClient();
    const date = new Date();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const currentDate = new Date(`${date.getFullYear()}-${pad(month.toString())}-${pad(day.toString())}T00:00:00Z`);
    const params = {
        TableName: 'birthdays',
    };

    const { Items } = await client.scan(params).promise();
    const bdays = _.orderBy(Items as BDay[], ['month', 'day'])
        .map((bday) => {
            const dateStr = `${currentDate.getFullYear()}-${pad(bday.month.toString())}-${pad(bday.day.toString())}T00:00:00Z`;
            const bdayDate = new Date(dateStr);
            return {
                ...bday,
                diff: getDayDiff(currentDate, bdayDate),
            };
        })
        .filter(({ diff }) => diff >= 0 && diff < 7);

    const group = _.groupBy(bdays, 'chat_id');
    const ids = Object.keys(group);

    const promises = ids.map((chatId) => {
        const chatBDays = group[chatId];
        if (chatBDays.length > 0) {
            return bot.telegram.sendMessage(
                chatId,
                prepareBdaysReply(chatBDays, 'Hey the are a some birthdays on this week'),
                { parse_mode: 'HTML' },
            );
        }
        return Promise.resolve();
    });

    return Promise.all(promises);
};

export default everyweek;
