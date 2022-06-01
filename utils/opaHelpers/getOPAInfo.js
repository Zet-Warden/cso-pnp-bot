/**
 * @param {opaNumber} opaNumber the number used as reference in the OPA sheets
 * @returns an object which contains OPA information with the columns as keys
 *          if opaNumber is invalid (e.g. reference does not exist, invalid OPA format)
 *          returns undefined
 */
async function getOPAInfo(opaNumber, rows) {
    //OPA numbers are only 1 until latest OPA number, i.e. 0 is false
    const isOPANumber = Boolean(Number(opaNumber));
    //OPA rows are 1-indexed, arrays are 0-indexed
    const opaInfo = isOPANumber && rows[opaNumber - 4282]; //offset is determined by the opa number at the first row

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

module.exports = getOPAInfo;
