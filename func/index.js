
const { Telegraf } = require('telegraf')
const _ = require('lodash')
const AWS = require('aws-sdk')
const { getChatId, prepareBdaysReply } = require('./utils')

AWS.config.update({
    region: process.env.AWS_REGION,
    endpoint: process.env.DB_ENDPOINT
})

const commandDescriptions = [
    '- /list_bdays list all birthdays'
]

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

bot.start((ctx) => ctx.reply('Hey! Send me /help if you want to know what I can do'))
bot.command('help', (ctx) => ctx.reply(commandDescriptions.join('\n')))

bot.command('list_bdays', async (ctx) => {
    const chatId = getChatId(ctx)
    const client = new AWS.DynamoDB.DocumentClient()
    const params = {
        TableName: 'birthdays',
        KeyConditionExpression: 'chat_id = :cid',
        ExpressionAttributeValues: {
            ':cid': chatId
        }
    }
    const { Items } = await client.query(params).promise()
    const bdays = _.orderBy(Items, ['month', 'day'])

    return ctx.reply(prepareBdaysReply(bdays), { parse_mode: 'HTML' })
})

bot.on('text', (ctx) => ctx.reply('Send me /help to get available commands'))

exports.handler = async (event) => {
    const body = JSON.parse(event.body)
    const message = _.get(body, ['message'])
    if (!message) {
        return { statusCode: 400 }
    }

    await bot.handleUpdate(body)

    return { statusCode: 200, body: '' }
}
