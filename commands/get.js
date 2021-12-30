const CommandHandler = require('../CommandHandler.js');
const { getRowInfo } = require('./sheets.js');

async function handleOPACommand(args) {
    const rowInfo = await getRowInfo(args[0]);
    if (!rowInfo) {
        return {
            type: 'message',
            textFormat: 'xml',
            text: `Unable to get OPA-Number: ${args[0]}`,
        };
    }

    const table = createTable(rowInfo);
    return {
        type: 'message',
        textFormat: 'xml',
        text: table,
    };
}

function createTable(info) {
    let tableHeader =
        '<table style="border: 1px solid black;border-collapse: collapse;">';

    const tableInfo = Object.keys(info).reduce((prev, currKey) => {
        return `${prev}
        <tr>
            <td style="width: max-content; font-weight: bold; padding: 0.75rem 1.5rem; border: 1px solid black;border-collapse: collapse;">
                ${currKey}:
            </td>
            <td style="padding: 0.75rem 1.5rem; border: 1px solid black;border-collapse: collapse;">
                ${
                    (info[currKey].includes('https')
                        ? `<a href=${info[currKey]}>Link</a>`
                        : info[currKey]) || 'N/A'
                }
            </td>
        </tr>`;
    }, '');

    return `${tableHeader}${tableInfo}`;
}

CommandHandler.registerCommand('get', handleOPACommand);
