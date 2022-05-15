const { Telegraf } = require('telegraf');
const AWS = require('aws-sdk');
const _ = require('lodash');
const { prepareBdaysReply } = require('../utils');

AWS.config.update({
    region: process.env.AWS_REGION,
    endpoint: process.env.DB_ENDPOINT,
});

const TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(TOKEN);

exports.handler = async () => {
    const client = new AWS.DynamoDB.DocumentClient();
    const currentMonth = new Date().getMonth() + 1;
    const params = {
        TableName: 'birthdays',
        FilterExpression: 'month = :month',
        ExpressionAttributeValues: { ':month': currentMonth },

    };

    const { Items } = await client.scan(params).promise();
    const bdays = _.orderBy(Items, ['month', 'day']);

    const group = _.groupBy(bdays, 'chat_id');
    const ids = Object.keys(group);

    for (let i = 0; i < ids.length; i++) {
        const chatId = ids[i];
        const chatBDays = group[chatId];

        if (chatBDays.length > 0) {
            // eslint-disable-next-line no-await-in-loop
            await bot.telegram.sendMessage(
                chatId,
                prepareBdaysReply(chatBDays, 'There are some birthdays in this month'),
                { parse_mode: 'HTML' },
            );
        }
    }

    return { statusCode: 200 };
};