import AWS from 'aws-sdk';

import _ from 'lodash';
import { BDay } from '../models';
import { getDayDiff, pad } from '../utils';
import { sendMessages } from './utils';

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

    return sendMessages(bdays, 'Hey the are a some birthdays on this week');
};

export default everyweek;
