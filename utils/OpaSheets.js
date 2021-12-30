const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const doc = new GoogleSpreadsheet(
    '1RxTwUTd1dYHIN1B9Buwcq8T_hyZp3Fm1P1T8jkeW7EQ'
);

doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
});

/**
 * Loads data from the google sheets into the doc object
 * @returns the corresponding OPA sheet and its rows
 */
async function loadOPASheetData() {
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['OPA']; // index of the OPA sheet
    const rows = await sheet.getRows();

    return { sheet, rows };
}

/**
 * @param {opaNumber} opaNumber the number used as reference in the OPA sheets
 * @returns an object which contains OPA information with the columns as keys
 *          if opaNumber is invalid (e.g. reference does not exist, invalid OPA format)
 *          returns undefined
 */
async function getOPAInfo(opaNumber) {
    const { rows } = await loadOPASheetData();

    //OPA numbers are only 1 until latest OPA number, i.e. 0 is false
    const isOPANumber = Boolean(Number(opaNumber));
    //OPA rows are 1-indexed, arrays are 0-indexed
    const opaInfo = isOPANumber && rows[opaNumber - 1];

    return opaInfo ? removeMetaDataFromOPAInfo(opaInfo) : undefined;
}

/**
 * Generates a new object without metadata from google sheets
 * @param {Object} opaInfo the OPA information from google sheets
 * @returns OPA object that contains OPA information without metadata from google sheets
 */
function removeMetaDataFromOPAInfo(opaInfo) {
    const opaObject = {}; //object that contains OPA information

    Object.keys(opaInfo).forEach((column) => {
        //metadata is prefixed with '_'
        if (column.charAt(0) != '_') {
            // const shortenedColumn = shortenColumnName(column);
            opaObject[column] = opaInfo[column] || 'N/A';
        }
    });
    return opaObject;
}

module.exports = {
    getOPAInfo,
};
