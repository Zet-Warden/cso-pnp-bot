const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const doc = new GoogleSpreadsheet(
    '1RxTwUTd1dYHIN1B9Buwcq8T_hyZp3Fm1P1T8jkeW7EQ'
);

let sheet, rows;

//load  the googlesheets document
async function loadOPASheetData() {
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();

    sheet = doc.sheetsByIndex[0]; // index of the OPA sheet
    rows = await sheet.getRows();
}

function verifyOPANumber(_opaNumber) {
    let isValid;

    //verify that the input is only string or number
    if (typeof _opaNumber != 'string' && typeof _opaNumber != 'number') {
        isValid = false;
    }

    //if string convert to number, otherwise remain
    if (typeof _opaNumber == 'string') {
        var opaNumber = Number(_opaNumber);
        //vaerify that the converted number is an actual number
        if (Number.isNaN(opaNumber)) isValid = false;
    } else {
        var opaNumber = _opaNumber;
    }

    console.log(_opaNumber);
    return {
        isValid: isValid == false ? isValid : _opaNumber + 1 <= rows.length,
        opaNumber,
    };
}

async function getRowInfo(_opaNumber) {
    //ensure that data is fresh when getting row info
    await loadOPASheetData();

    const { isValid, opaNumber } = verifyOPANumber(_opaNumber);
    const index = opaNumber - 1;

    if (isValid) {
        return generateRowInfoObject(rows[index]);
    }
    return undefined;
}

function generateRowInfoObject(rowInfo) {
    const rowObject = {};
    Object.keys(rows[0]).forEach((key) => {
        if (key.charAt(0) != '_') {
            const shortenedKey = shortenKey(key);
            rowObject[shortenedKey] = rowInfo[key];
        }
    });
    return rowObject;
}

function shortenKey(prop) {
    switch (prop) {
        case 'Activity Reference Number (ARN)':
            return 'ARN';
        case 'Type of Publicity Material':
            return 'Publicity Material';
        case 'Social Media Platform for Posting':
            return 'Social Media Platform';
        default:
            return prop;
    }
}

module.exports = {
    getRowInfo,
};
