const { DateTime } = require('luxon');
const { sendHTMLEmail } = require('../Mailer.js');

const STATUS_COL_INDEX = 15;
const REMARKS_COL_INDEX = 16;
const CHECKED_BY_COL_INDEX = 17;
const AVC_COL_INDEX = 18;
const DATA_CHECKED_COL_INDEX = 19;
const EMAIL_STATUS_COL_INDEX = 20;

async function setOPAInfo(
    opaSheet,
    rows,
    { isOverride = false, opaNumber, status, remarks = '', checkedBy = '' }
) {
    //OPA numbers are only 1 until latest OPA number, i.e. 0 is false
    const isOPANumber = Boolean(Number(opaNumber));
    //OPA rows are 1-indexed, arrays are 0-indexed
    const opaInfo = isOPANumber && rows[opaNumber - 1];

    //exit immediately if invalid OPA number
    if (!opaInfo) {
        return undefined;
    } else if (!isOverride && hasOPABeenChecked(opaNumber, rows)) {
        return false;
    }

    setOPAInfoInBackground(opaSheet, opaInfo, {
        opaNumber,
        status,
        remarks,
        checkedBy,
    });

    return true;
}

async function setOPAInfoInBackground(
    opaSheet,
    opaInfo,
    { opaNumber, status, remarks = '', checkedBy = '' }
) {
    //different from rows
    //rows are 0-indexed but skips the header, cells do not
    const rowIndex = opaNumber;
    await opaSheet.loadCells({
        startRowIndex: rowIndex,
        endRowIndex: rowIndex + 1, //end exclusive
        startColumnIndex: STATUS_COL_INDEX,
        endColumnIndex: EMAIL_STATUS_COL_INDEX + 1, //end exclusive
    });

    const statusCell = opaSheet.getCell(rowIndex, STATUS_COL_INDEX);
    const remarksCell = opaSheet.getCell(rowIndex, REMARKS_COL_INDEX);
    const checkedByCell = opaSheet.getCell(rowIndex, CHECKED_BY_COL_INDEX);
    const dateCheckedCell = opaSheet.getCell(rowIndex, DATA_CHECKED_COL_INDEX);
    const emailStatusCell = opaSheet.getCell(rowIndex, EMAIL_STATUS_COL_INDEX);

    const dateTime = getDateTime();
    statusCell.value = status == 'APPROVED' ? 'Approved' : 'Pended';
    remarksCell.value = remarks;
    checkedByCell.value = checkedBy;
    dateCheckedCell.value = dateTime.date;
    emailStatusCell.value = `Email sent on ${dateTime.timestamp} (via MSTeams)`;

    await opaSheet.saveUpdatedCells();

    await sendHTMLEmail({
        ...opaInfo,
        ...{
            Status: statusCell.value,
            Remarks: remarksCell.value,
            Position: getAuthorizationPosition(checkedBy),
            'Checked By': checkedByCell.value,
            'Date Checked': dateCheckedCell.value,
            'AVC-In-Charge': opaInfo['AVC-In-Charge']
                ? opaInfo['AVC-In-Charge']
                : 'N/A',
        },
    });
}

function hasOPABeenChecked(opaNumber, rows) {
    //OPA numbers are only 1 until latest OPA number, i.e. 0 is false
    const isOPANumber = Boolean(Number(opaNumber));
    //OPA rows are 1-indexed, arrays are 0-indexed
    const opaInfo = isOPANumber && rows[opaNumber - 1];

    return opaInfo ? Boolean(opaInfo['Status']) : false;
}

function getDateTime() {
    //get timestamp
    const today = DateTime.now().setZone('UTC+8');
    const month = String(today.month).padStart(2, '0');
    const date = String(today.day).padStart(2, '0');
    const year = String(today.year).padStart(2, '0');

    let hours = String(today.hour).padStart(2, '0');
    hours = hours >= 13 ? hours - 12 : hours;
    const minutes = String(today.minute).padStart(2, '0');
    const seconds = String(today.second).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';

    return {
        timestamp: `${month}/${date}/${year} at ${hours}:${minutes}:${seconds} ${ampm}`,
        date: `${month}/${date}/${year}`,
        time: `${hours}:${minutes}:${seconds} ${ampm}`,
    };
}

function getAuthorizationPosition(name) {
    const authorizationTable = {
        'Ria Panugan': 'Vice Chairperson',
        'Jacob Sy': 'Associate Vice Chairperson',
        'Alicia Concepcion': 'Associate Vice Chairperson',
        'Ry De Vicente': 'Associate Vice Chairperson',
        'Nathan Go': 'Associate Vice Chairperson',
        'Jaisa Perez': 'Associate Vice Chairperson',
        'Fritz Beloso': 'Associate Vice Chairperson',
        'Miguel Panganiban': 'Associate Vice Chairperson',
        'Ruiz Chavez': 'Associate Vice Chairperson',
        'Allen Ereña': 'Associate Vice Chairperson',
    };

    const position = authorizationTable[name];
    return position ? position : 'Associate';
}

module.exports = setOPAInfo;
