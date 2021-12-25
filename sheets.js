const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const doc = new GoogleSpreadsheet(
    '1RxTwUTd1dYHIN1B9Buwcq8T_hyZp3Fm1P1T8jkeW7EQ'
);

let sheet, rows;

//load  the googlesheets document
(async function () {
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();

    sheet = doc.sheetsByIndex[0]; // the first sheet
    rows = await sheet.getRows();
})();

function verifyOPANumber(_opaNumber) {
    //verify that the input is only string or number
    if (typeof _opaNumber != 'string' && typeof _opaNumber != 'number')
        throw 'parameter _opaNumber must be either a string or a number';

    //if string convert to number, otherwise remain
    if (typeof _opaNumber == 'string') {
        var opaNumber = Number(_opaNumber);
    } else {
        var opaNumber = _opaNumber;
    }

    //throw if string cannot be represented as a number
    if (Number.isNaN(opaNumber))
        throw 'parameter _opaNumber must be a covertible to number';

    return { isValid: _opaNumber + 1 <= rows.length, opaNumber };
}

async function getRowInfo(_opaNumber) {
    const { isValid, opaNumber } = verifyOPANumber(_opaNumber);
    const index = opaNumber - 1;
    return { isValid, info: rows[index] };
}
