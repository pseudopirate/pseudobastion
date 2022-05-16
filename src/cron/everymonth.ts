import AWS from 'aws-sdk';
import _ from 'lodash';
import { BDay } from '../models';
import { sendMessages } from './utils';

AWS.config.update({
    region: process.env.AWS_REGION,
    // @ts-ignore
    endpoint: process.env.DB_ENDPOINT,
});

const everymonth = async () => {
    const client = new AWS.DynamoDB.DocumentClient();
    const currentMonth = new Date().getMonth() + 1;
    const params = {
        TableName: 'birthdays',
        FilterExpression: 'month = :month',
        ExpressionAttributeValues: { ':month': currentMonth },

    };

    const { Items } = await client.scan(params).promise();
    const bdays = _.orderBy(Items as BDay[], ['month', 'day']);

    return sendMessages(bdays, 'There are some birthdays in this month');
};

export default everymonth;
