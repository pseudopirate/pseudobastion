
require('dotenv').config()
const { Telegraf, session, Scenes } = require('telegraf')
const AWS = require('aws-sdk')
const { telegrafThrottler } = require('telegraf-throttler')
const { initBastionCommands } = require('../utils')
const { bdaysScene } = require('./scenes')

AWS.config.update({
    region: process.env.AWS_REGION,
    endpoint: process.env.DB_ENDPOINT
})

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

const stage = new Scenes.Stage([bdaysScene])
const throttler = telegrafThrottler()

bot.use(throttler)
bot.use(session())
bot.use(stage.middleware())
initBastionCommands(bot, AWS)

bot.launch()
console.log('Bot started')
