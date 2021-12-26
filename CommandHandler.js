class CommanHandler {
    constructor() {
        this.commands = {};
    }

    registerCommand(command, commandAction) {
        var command = command.toLowerCase();
        if (this.commands[command] != undefined) {
            throw `command ${command} is already registered. try another command name`;
        }

        this.commands[command] = commandAction;
    }

    handleCommand(command, args) {
        return this.commands[command](args);
    }
}

module.exports = new CommanHandler();
