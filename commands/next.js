const CommandHandler = require('../CommandHandler.js');
const {
    createTextMessage,
    createHTMLMessage,
} = require('../MessageCreator.js');
const { getNextOPAInfo } = require('../utils/OpaSheets.js');

async function sendNextOPAInfo() {
    const opaInfo = await getNextOPAInfo();

    if (!opaInfo) {
        return createTextMessage(`All OPAs has been currently checked.`);
    }

    const table = createTable(opaInfo);
    return createHTMLMessage(table);
}

/**
 * Formats the OPA Object into an HTML table
 * @param {Object} info object containing OPA related information
 * @returns {String} html table
 */
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

CommandHandler.registerCommand('next', sendNextOPAInfo);
