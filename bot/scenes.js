const { Scenes } = require('telegraf')
const validate = require('./validations')
const { putBday } = require('./db')
const { prepareBdaysReply, getChatId, sendError } = require('../utils')
const { SCENE_IDS } = require('../consts')

const bdaysScene = new Scenes.WizardScene(SCENE_IDS.BDAY_ADD,
    (ctx) => {
        ctx.editMessageText('Enter name')
        ctx.wizard.state.bdayData = {}
        return ctx.wizard.next()
    },
    (ctx) => {
        if (ctx.message.text === '/cancel') {
            ctx.reply('Aborted')
            return ctx.scene.leave()
        }

        if (validate.name(ctx)) {
            ctx.reply('Invalid name')
            return
        }

        ctx.wizard.state.bdayData.name = ctx.message.text
        ctx.reply('Enter month. It should be a number between 1-12')

        return ctx.wizard.next()
    },
    (ctx) => {
        if (ctx.message.text === '/cancel') {
            ctx.reply('Aborted')
            return ctx.scene.leave()
        }
        if (validate.month(ctx)) {
            ctx.reply('Invalid month. It should be a number between 1-12')
            return
        }

        ctx.wizard.state.bdayData.month = Number(ctx.message.text)
        ctx.reply('Enter day')

        return ctx.wizard.next()
    },
    async (ctx) => {
        if (ctx.message.text === '/cancel') {
            ctx.reply('Aborted')
            return ctx.scene.leave()
        }

        const month = ctx.wizard.state.bdayData.month

        if (validate.day(ctx)) {
            ctx.reply(`Invalid day. It should be a number between 1-${validate.getDaysCount(month)}`)
            return
        }

        ctx.wizard.state.bdayData.day = Number(ctx.message.text)

        const data = ctx.wizard.state.bdayData
        try {
            await putBday(data, getChatId(ctx))
        } catch (error) {
            sendError(error.message)
            return ctx.reply('Error. Try again or enter /cancel to cancel')
        }

        ctx.reply(prepareBdaysReply([data], 'New birthday added'), { parse_mode: 'HTML' })

        return ctx.scene.leave()
    }
)

module.exports = {
    bdaysScene
}
