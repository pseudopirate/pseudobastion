import AWS from 'aws-sdk';
import _ from 'lodash';
import { BDay } from '../models';
import { sendMessages } from './utils';

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

    console.log(bdays);

    return sendMessages(bdays as BDay[], "Hey, someone has birthday today! Don't forget to wish him happy birthday");
};

export default everyday;
