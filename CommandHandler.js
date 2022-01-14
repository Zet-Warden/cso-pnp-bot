const { createTextMessage } = require('./MessageCreator');

const CommanHandler = {
    commands: {},

    registerCommand(_command, commandAction) {
        var command = _command.toLowerCase();
        if (this.commands[command] != undefined) {
            throw `Command "${_command}" is already registered. Try another command name`;
        }

        this.commands[command] = commandAction;
    },

    handleCommand(_command, args) {
        var command = _command.toLowerCase();
        console.log(this.commands);
        console.log(this.commands[command]);
        console.log(this.commands[command] == undefined);
        if (this.commands[command] == undefined) {
            return createTextMessage(
                `"${_command}" is not a registered command. Please try again`
            );
        }
        return this.commands[command](args);
    },
};

module.exports = CommanHandler;
