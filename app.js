require('dotenv').config();
const express = require('express');
const app = express();

const messagesRouter = require('./routes/messages.js');

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

//---------- Server -------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/messages', messagesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening at localhost:${PORT}`);
});
