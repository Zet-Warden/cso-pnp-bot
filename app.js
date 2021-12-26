const express = require('express');
const app = express();
require('dotenv').config();

const messagesRouter = require('./routes/messages.js');
registerCommands();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/messages', messagesRouter);

function registerCommands() {
    //register the commands from the commands folder to the command handler
    const fs = require('fs');
    const path = require('path');
    const fileNames = fs.readdirSync(path.join(__dirname, 'commands'));

    fileNames.forEach((fileName) => {
        if (fileName.endsWith('.js')) {
            require(`./commands/${fileName}`);
        }
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening at localhost:${PORT}`);
});
