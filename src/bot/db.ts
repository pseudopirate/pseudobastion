import AWS from 'aws-sdk';
import { BDay } from '../models';

AWS.config.update({
    region: process.env.AWS_REGION,

    // @ts-ignore
    endpoint: process.env.DB_ENDPOINT,
});

const client = new AWS.DynamoDB.DocumentClient();

/* eslint-disable-next-line camelcase */
export const putBday = async (bday: BDay, chat_id: string) => {
    const params = {
        TableName: 'birthdays',
        Item: {
            ...bday,
            chat_id, // eslint-disable-line camelcase
            created_at: Date.now(),
        },
    };

    return client.put(params).promise();
};
