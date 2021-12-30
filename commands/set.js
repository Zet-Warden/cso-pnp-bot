const CommandHandler = require('../CommandHandler.js');
const { createTextMessage } = require('../MessageCreator.js');

function setOPAInfo([opaNumber, status, ...remarks]) {
    return createTextMessage('Set is not yet available');
}

CommandHandler.registerCommand('set', setOPAInfo);
