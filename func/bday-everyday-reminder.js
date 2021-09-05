const { Telegraf } = require('telegraf')
const AWS = require('aws-sdk')
const { prepareBdaysReply } = require('../utils')
const _ = require('lodash')

AWS.config.update({
    region: process.env.AWS_REGION,
    endpoint: process.env.DB_ENDPOINT
})

const TOKEN = process.env.TELEGRAM_TOKEN
const bot = new Telegraf(TOKEN)

exports.handler = async (event) => {
    const client = new AWS.DynamoDB.DocumentClient()
    const currentMonth = new Date().getMonth() + 1
    const currentDay = new Date().getDate()
    const params = {
        TableName: 'birthdays',
        FilterExpression: 'month = :month and day = :day',
        ExpressionAttributeValues: { ':month': currentMonth, ':day': currentDay }
    }

    const { Items } = await client.scan(params).promise()
    const bdays = _.orderBy(Items, ['month', 'day'])

    const group = _.groupBy(bdays, 'chat_id')
    const ids = Object.keys(group)

    for (let i = 0; i < ids.length; i++) {
        const chatId = ids[i]
        const chatBDays = group[chatId]

        if (chatBDays.length > 0) {
            await bot.telegram.sendMessage(
                chatId,
                prepareBdaysReply(chatBDays, "Hey, someone has birthday today! Don't forget to wish him happy birthday"),
                { parse_mode: 'HTML' }
            )
        }
    }

    return { statusCode: 200 }
}
