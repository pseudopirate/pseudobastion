import AWS from 'aws-sdk';
import _ from 'lodash';
import { bot } from '../bot';
import { BDay } from '../models';
import { prepareBdaysReply } from '../utils';

AWS.config.update({
    region: process.env.AWS_REGION,
    // @ts-ignore
    endpoint: process.env.DB_ENDPOINT,
});

const everyday = async () => {
    const client = new AWS.DynamoDB.DocumentClient();
    const currentMonth = new Date().getMonth() + 1;
    const currentDay = new Date().getDate();
    const params = {
        TableName: 'birthdays',
        FilterExpression: 'month = :month and day = :day',
        ExpressionAttributeValues: { ':month': currentMonth, ':day': currentDay },
    };

    const { Items } = await client.scan(params).promise();
    const bdays = _.orderBy(Items as BDay[], ['month', 'day']);

    const group = _.groupBy(bdays, 'chat_id');
    const ids = Object.keys(group);

    const promises = ids.map((chatId) => {
        const chatBDays = group[chatId];

        if (chatBDays.length > 0) {
            return bot.telegram.sendMessage(
                chatId,
                prepareBdaysReply(chatBDays, "Hey, someone has birthday today! Don't forget to wish him happy birthday"),
                { parse_mode: 'HTML' },
            );
        }

        return Promise.resolve();
    });

    return Promise.all(promises);
};

export default everyday;
