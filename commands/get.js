const CommandHandler = require('../CommandHandler.js');
const {
    createTextMessage,
    createHTMLMessage,
} = require('../MessageCreator.js');
const { getOPAInfo } = require('../utils/OpaSheets.js');

async function handleOPACommand(args) {
    const rowInfo = await getOPAInfo(args[0]);
    console.log(rowInfo);
    if (!rowInfo) {
        return createTextMessage(`Unable to get OPA-Number: ${args[0]}`);
    }

    const table = createTable(rowInfo);
    return createHTMLMessage(table);
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
