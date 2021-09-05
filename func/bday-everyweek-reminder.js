const { Telegraf } = require('telegraf')
const AWS = require('aws-sdk')
const { prepareBdaysReply, getDayDiff, pad } = require('../utils')
const _ = require('lodash')

AWS.config.update({
    region: process.env.AWS_REGION,
    endpoint: process.env.DB_ENDPOINT
})

const TOKEN = process.env.TELEGRAM_TOKEN
const bot = new Telegraf(TOKEN)

exports.handler = async (event) => {
    const client = new AWS.DynamoDB.DocumentClient()
    const date = new Date()
    const currentDate = new Date(`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T00:00:00Z`)
    const params = {
        TableName: 'birthdays'
    }

    const { Items } = await client.scan(params).promise()
    const bdays = _.orderBy(Items, ['month', 'day'])
        .map((bday) => {
            const bdayDate = new Date(`${currentDate.getFullYear()}-${pad(bday.month)}-${pad(bday.day)}T00:00:00Z`)
            return {
                ...bday,
                diff: getDayDiff(currentDate, bdayDate)
            }
        })
        .filter(({ diff }) => diff >= 0 && diff < 7)

    const group = _.groupBy(bdays, 'chat_id')
    const ids = Object.keys(group)

    for (let i = 0; i < ids.length; i++) {
        const chatId = ids[i]
        const chatBDays = group[chatId]

        if (chatBDays.length > 0) {
            await bot.telegram.sendMessage(
                chatId,
                prepareBdaysReply(chatBDays, 'Hey the are a some birthdays on this week'),
                { parse_mode: 'HTML' }
            )
        }
    }

    return { statusCode: 200 }
}
