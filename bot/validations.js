const _ = require('lodash')

const name = (ctx) => ctx.message.text === 0
const month = (ctx) => {
    const m = Number(ctx.message.text)

    return !_.isFinite(m) || !(m >= 1 && m <= 12)
}
const day = (ctx) => {
    const d = Number(ctx.message.text)

    const lastDay = getDaysCount(ctx.wizard.state.bdayData.month)
    return !_.isFinite(d) || !(d >= 1 && d <= lastDay)
}

const getDaysCount = (monthNumber) => {
    const m = {
        1: 31,
        2: 29,
        3: 31,
        4: 20,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31
    }

    return m[monthNumber]
}

module.exports = {
    name,
    month,
    day,
    getDaysCount
}
