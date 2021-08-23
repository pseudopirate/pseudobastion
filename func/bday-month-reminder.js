const { Telegraf } = require('telegraf')
const AWS = require('aws-sdk')
const { prepareBdaysReply } = require('./utils')
const _ = require('lodash')

AWS.config.update({
    region: process.env.AWS_REGION,
    endpoint: process.env.DB_ENDPOINT
})

const TOKEN = process.env.TELEGRAM_TOKEN
const bot = new Telegraf(TOKEN)

exports.handler = async (event) => {
    const client = new AWS.DynamoDB.DocumentClient()
    const params = {
        TableName: 'birthdays',
        KeyConditionExpression: 'chat_id = :cid',
        ExpressionAttributeValues: {
            ':cid': Number(process.env.CHAT_ID)
        }
    }

    const { Items } = await client.query(params).promise()
    const bdays = _.orderBy(Items, ['month', 'day'])
    const currentMonth = new Date().getMonth()
    const preparedBDays = bdays
        .filter((item) => item.month - 1 === currentMonth)

    if (preparedBDays.length > 0) {
        await bot.telegram.sendMessage(process.env.CHAT_ID, prepareBdaysReply(preparedBDays, 'There are some dbays in this month'), { parse_mode: 'HTML' })
    }

    return { statusCode: 200 }
}
