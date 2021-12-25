const crypto = require('crypto');
const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/messages/api', (req, res) => {
    const { from } = req.body;
    const username = from.name;
    res.json({ type: 'message', text: `Hello ${username}` });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening at localhost:${PORT}`);
});
