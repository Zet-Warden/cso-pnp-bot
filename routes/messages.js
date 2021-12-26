const express = require('express');
const router = express.Router();
const CommandHandler = require('../CommandHandler.js');

router.post('/api', async (req, res) => {
    const { text } = req.body;

    // const [mention, content] = text.split('!');
    //console.log(text);
    const [mention, command, ...args] = text.split(/[ ]+/);
    //console.log(mention, command, args);
    const response = await CommandHandler.handleCommand(command, args);

    res.json(response);
});

module.exports = router;
