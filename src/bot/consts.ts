import { Markup } from "telegraf";

export const commandDescriptions = [
    '- /birthdays manage birthdays',
];

export const BDAYS_ACTIONS = {
    List: 'list-bdays',
    Add: 'add-bdays',
};

export const bdaysKeyboard = Markup.inlineKeyboard([
    Markup.button.callback('List birthdays', BDAYS_ACTIONS.List),
    Markup.button.callback('Add new birthday', BDAYS_ACTIONS.Add),
]);
