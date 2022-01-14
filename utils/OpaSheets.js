const { GoogleSpreadsheet } = require('google-spreadsheet');
const getOPAInfoFromRows = require('./opaHelpers/getOPAInfo.js');
const setOPAInfoAndSendEmail = require('./opaHelpers/setOPAInfo.js');
const getNextOPAInfoFromRows = require('./opaHelpers/getNextOPAInfo.js');
require('dotenv').config();

const doc = new GoogleSpreadsheet(
    '1RxTwUTd1dYHIN1B9Buwcq8T_hyZp3Fm1P1T8jkeW7EQ'
);

doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
});

let opaSheet, rows;
loadOPASheetData();

/**
 * Loads data from the google sheets into the doc object
 * @returns the corresponding OPA sheet and its rows
 */
async function loadOPASheetData() {
    await doc.loadInfo();

    opaSheet = doc.sheetsByTitle['OPA']; // index of the OPA sheet
    rows = await opaSheet.getRows();
}

async function reloadOPASheetRows() {
    rows = await opaSheet.getRows();
}

/**
 * @param {opaNumber} opaNumber the number used as reference in the OPA sheets
 * @returns an object which contains OPA information with the columns as keys
 *          if opaNumber is invalid (e.g. reference does not exist, invalid OPA format)
 *          returns undefined
 */
async function getOPAInfo(opaNumber) {
    await reloadOPASheetRows();
    return getOPAInfoFromRows(opaNumber, rows);
}

async function setOPAInfo(data) {
    await reloadOPASheetRows();
    return setOPAInfoAndSendEmail(opaSheet, rows, data);
}

async function getNextOPAInfo() {
    await reloadOPASheetRows();
    return getNextOPAInfoFromRows(rows);
}

module.exports = {
    getOPAInfo,
    setOPAInfo,
    getNextOPAInfo,
};
