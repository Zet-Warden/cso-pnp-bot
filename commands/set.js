const CommandHandler = require('../CommandHandler.js');
const { createTextMessage } = require('../MessageCreator.js');
const { setOPAInfo, hasOPABeenChecked } = require('../utils/OpaSheets.js');

async function checkOPA({
    meta: { username },
    args: [opaNumber, status = '', ...remarks],
}) {
    if (await hasOPABeenChecked(opaNumber)) {
        return createTextMessage(
            `The OPA number ${opaNumber} provided has already been checked. If you wish to override these values, use command "ovr" instead.`
        );
    }

    //check if valid status set
    var status = formatStatus(status);
    if (!status) {
        return createTextMessage('Invalid status set.');
    }

    var remarks = remarks.join(' ');

    //split by whitespace
    const usernameArr = username.split(/[ ]+/);
    //only input first and last name (input format in google sheets)
    const checkedBy = `${usernameArr.slice(0, 1)} ${usernameArr.slice(-1)}`;
    setOPAInfo({ opaNumber, status, remarks, checkedBy });
    return createTextMessage(
        'Command acknowledged. In order to check if cells have been properly set and email has been sent, please use the "get" command.'
    );
}

function formatStatus(status) {
    var status = status.toUpperCase();

    switch (status.charAt(0)) {
        case 'A':
            return 'APPROVED';
        case 'P':
            return 'PENDED';
        default:
            return undefined;
    }
}

CommandHandler.registerCommand('set', checkOPA);
