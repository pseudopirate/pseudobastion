const { Telegraf } = require('telegraf')

const TOKEN = process.env.TELEGRAM_TOKEN
const bot = new Telegraf(TOKEN)

exports.handler = async (event) => {
    bot.telegram.sendMessage(process.env.CHAT_ID, 'ololololo')

    return { statusCode: 200 }
}
