const CommandHandler = require('../CommandHandler.js');
const {
    createTextMessage,
    createHTMLMessage,
} = require('../MessageCreator.js');
const { getOPAInfo } = require('../utils/OpaSheets.js');

/**
 * Sends a message to MSTeams containing the info of the requested OPA number
 * @param {String} opaNumber first argument sent with the command
 * @returns MSTeam response object, containing info about the requested OPA number
 */
async function sendOPAInfo({ args: [opaNumber] }) {
    const opaInfo = await getOPAInfo(opaNumber);

    if (!opaInfo) {
        return createTextMessage(`Unable to get OPA-Number: ${opaNumber}`);
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

CommandHandler.registerCommand('get', sendOPAInfo);
