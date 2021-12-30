async function getOpaInfo(_opaNumber) {
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
