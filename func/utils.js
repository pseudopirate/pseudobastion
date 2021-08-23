const _ = require('lodash')
const getChatId = (ctx) => _.get(ctx, ['update', 'message', 'chat', 'id'])

const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

const prepareBdaysReply = (bdays, prefix) => {
    return '#birthdays\n' + prefix + '\n' + bdays.map((item) =>
        `${_.padStart(item.day, 2, '0')} ${months[item.month - 1]} - <b>${item.name}</b>`).join('\n')
}

module.exports = {
    getChatId,
    prepareBdaysReply,
    months
}
