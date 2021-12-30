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
        if (this.commands[command] == undefined) {
            return {
                type: 'message',
                text: `"${_command}" is not a registered command. Please try again`,
            };
        }
        return this.commands[command](args);
    },
};

module.exports = CommanHandler;

//register the commands from the commands folder to the command handler
(function registerCommands() {
    const fs = require('fs');
    const path = require('path');
    const fileNames = fs.readdirSync(path.join(__dirname, 'commands'));

    fileNames.forEach((fileName) => {
        if (fileName.endsWith('.js')) {
            require(`./commands/${fileName}`);
        }
    });
})();
