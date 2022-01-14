function getNextOPAInfo(rows) {
    const opaInfo = rows.find((opaInfo) => opaInfo['Checked By'] == undefined);
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
            opaObject[column] = opaInfo[column] || '';
        }
    });
    return opaObject;
}

module.exports = getNextOPAInfo;
