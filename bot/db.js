const AWS = require('aws-sdk')

AWS.config.update({
    region: process.env.AWS_REGION,
    endpoint: process.env.DB_ENDPOINT
})

const client = new AWS.DynamoDB.DocumentClient()

/* eslint-disable-next-line camelcase */
const putBday = async (bday, chat_id) => {
    const params = {
        TableName: 'birthdays',
        Item: {
            ...bday,
            chat_id,
            created_at: Date.now()
        }
    }

    return client.put(params).promise()
}

module.exports = { putBday }
