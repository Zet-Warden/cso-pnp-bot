const express = require('express');
const router = express.Router();
const CommandHandler = require('../CommandHandler.js');

router.post('/api', async (req, res) => {
    const { text, from, timestamp, channelId } = req.body;

    const meta = {
        username: from.name,
        userId: from.id,
        timestamp: timestamp,
        channelName: channelId.split('/')[0],
        channelId: channelId.split('/')[1],
    };

    console.log('meta information:', meta);
    console.log('user message:', text);
    const [mention, command, ...args] = text
        .replace('&nbsp;', ' ')
        .split(/[ ]+/);
    console.log('mention:', mention, 'command:', command, 'arguments:', args);
    const response = await CommandHandler.handleCommand(command, {
        meta,
        args,
    });

    res.json(response);
});

module.exports = router;
