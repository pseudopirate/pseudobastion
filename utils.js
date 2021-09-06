const _ = require('lodash')
const { Telegraf, Markup } = require('telegraf')
const { SCENE_IDS } = require('./consts')

const getChatId = (ctx) => _.get(ctx, ['update', 'message', 'chat', 'id']) ||
_.get(ctx, ['update', 'callback_query', 'message', 'chat', 'id'])

const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

const pad = (str) => _.padStart(str, 2, '0')

const prepareBdaysReply = (bdays, prefix = '') => {
    return '#birthdays\n' + prefix + '\n' + bdays.map((item) =>
        `${pad(item.day)} ${months[item.month - 1]} - <b>${item.name}</b>`).join('\n')
}

const getDayDiff = (today, bday) => Math.round((bday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

const commandDescriptions = [
    '- /birthdays manage birthdays'
]

const BDAYS_ACTIONS = {
    List: 'list-bdays',
    Add: 'add-bdays'
}

const bdaysKeyboard = Markup.inlineKeyboard([
    Markup.button.callback('List birthdays', BDAYS_ACTIONS.List),
    Markup.button.callback('Add new birthday', BDAYS_ACTIONS.Add)
])

const initBastionCommands = (bot, AWS) => {
    bot.start((ctx) => ctx.reply('Hey! Send me /help if you want to know what I can do'))
    bot.command('help', (ctx) => ctx.reply(commandDescriptions.join('\n')))
    bot.command('birthdays', (ctx) => {
        ctx.reply('What do you wanna do?', bdaysKeyboard)
    })
    bot.command('bdays', (ctx) => {
        ctx.reply('What do you wanna do?', bdaysKeyboard)
    })

    bot.action(BDAYS_ACTIONS.List, async (ctx) => {
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

        return ctx.editMessageText(prepareBdaysReply(bdays), { parse_mode: 'HTML' })
    })

    bot.action(BDAYS_ACTIONS.Add, (ctx) => {
        ctx.answerCbQuery()
        return ctx.scene.enter(SCENE_IDS.BDAY_ADD)
    })

    bot.on('text', (ctx) => ctx.reply('Send me /help to get available commands'))
}

const sendError = (msg) => {
    const bot = new Telegraf(process.env.TELEGRAM_TOKEN)
    bot.telegram.sendMessage(process.env.CHAT_ID, msg)
}

module.exports = {
    getChatId,
    prepareBdaysReply,
    months,
    getDayDiff,
    pad,
    initBastionCommands,
    sendError
}
