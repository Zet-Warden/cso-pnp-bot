const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

const doc = new GoogleSpreadsheet(
    '1RxTwUTd1dYHIN1B9Buwcq8T_hyZp3Fm1P1T8jkeW7EQ'
);

doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
});

//loads OPA worksheet
async function loadOPASheetData() {
    await doc.loadInfo();

    const sheet = doc.sheetsByTitle['OPA']; // index of the OPA sheet
    const rows = await sheet.getRows();

    return { sheet, rows };
}

module.exports = {
    loadOPASheetData,
};
