const { GoogleSpreadsheet } = require('google-spreadsheet');
const { sendHTMLEmail } = require('./Mailer.js');
require('dotenv').config();

const doc = new GoogleSpreadsheet(
    '1RxTwUTd1dYHIN1B9Buwcq8T_hyZp3Fm1P1T8jkeW7EQ'
);

doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
});

let sheet, rows;
loadOPASheetData();

/**
 * Loads data from the google sheets into the doc object
 * @returns the corresponding OPA sheet and its rows
 */
async function loadOPASheetData() {
    await doc.loadInfo();

    sheet = doc.sheetsByTitle['OPA']; // index of the OPA sheet
    rows = await sheet.getRows();
}

/**
 * @param {opaNumber} opaNumber the number used as reference in the OPA sheets
 * @returns an object which contains OPA information with the columns as keys
 *          if opaNumber is invalid (e.g. reference does not exist, invalid OPA format)
 *          returns undefined
 */
async function getOPAInfo(opaNumber) {
    //OPA numbers are only 1 until latest OPA number, i.e. 0 is false
    const isOPANumber = Boolean(Number(opaNumber));
    //OPA rows are 1-indexed, arrays are 0-indexed
    const opaInfo = isOPANumber && rows[opaNumber - 1];

    return opaInfo ? removeMetaDataFromOPAInfo(opaInfo) : undefined;
}

async function setOPAInfo({ opaNumber, status, remarks = '', checkedBy = '' }) {
    //OPA numbers are only 1 until latest OPA number, i.e. 0 is false
    const isOPANumber = Boolean(Number(opaNumber));
    //OPA rows are 1-indexed, arrays are 0-indexed
    const opaInfo = isOPANumber && rows[opaNumber - 1];

    //exit immediately if invalid OPA number
    if (!opaInfo) {
        return undefined;
    }

    //different from rows
    //rows are 0-indexed but skips the header, cells do not
    const rowIndex = opaNumber;
    await sheet.loadCells({
        startRowIndex: rowIndex,
        endRowIndex: rowIndex + 1,
        startColumnIndex: 15,
        endColumnIndex: 21,
    });

    const statusCell = sheet.getCell(rowIndex, 15);
    const remarksCell = sheet.getCell(rowIndex, 16);
    const checkedByCell = sheet.getCell(rowIndex, 17);
    const dateCheckedCell = sheet.getCell(rowIndex, 19);
    const emailStatusCell = sheet.getCell(rowIndex, 20);

    //get current month, date, year
    const today = new Date();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const year = today.getFullYear();

    statusCell.value = status == 'APPROVED' ? 'Approved' : 'Pended';
    remarksCell.value = remarks;
    checkedByCell.value = checkedBy;
    dateCheckedCell.value = `${month}/${date}/${year}`;
    emailStatusCell.value = `Email sent on ${month}/${date}/${year} (via MSTeams)`;

    await sheet.saveUpdatedCells();
    await sendHTMLEmail({
        ...opaInfo,
        ...{
            Status: statusCell.value,
            Remarks: remarksCell.value,
            'Checked By': checkedByCell.value,
            'Date Checked': dateCheckedCell.value,
            'AVC-In-Charge': opaInfo['AVC-In-Charge']
                ? opaInfo['AVC-In-Charge']
                : 'N/A',
        },
    });
}

async function hasOPABeenChecked(opaNumber) {
    await loadOPASheetData();

    //OPA numbers are only 1 until latest OPA number, i.e. 0 is false
    const isOPANumber = Boolean(Number(opaNumber));
    //OPA rows are 1-indexed, arrays are 0-indexed
    const opaInfo = isOPANumber && rows[opaNumber - 1];

    return opaInfo ? Boolean(opaInfo['Email Status']) : false;
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
            opaObject[column] = opaInfo[column] || '';
        }
    });
    return opaObject;
}

module.exports = {
    getOPAInfo,
    setOPAInfo,
    hasOPABeenChecked,
};
