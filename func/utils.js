const _ = require('lodash')
const getChatId = (ctx) => _.get(ctx, ['update', 'message', 'chat', 'id'])

const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

const pad = (str) => _.padStart(str, 2, '0')

const prepareBdaysReply = (bdays, prefix) => {
    return '#birthdays\n' + prefix + '\n' + bdays.map((item) =>
        `${pad(item.day)} ${months[item.month - 1]} - <b>${item.name}</b>`).join('\n')
}

const getDayDiff = (date1, date2) => (date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24)

module.exports = {
    getChatId,
    prepareBdaysReply,
    months,
    getDayDiff,
    pad
}
