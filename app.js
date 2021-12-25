const crypto = require('crypto');
const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/messages/api', (req, res) => {
    console.log('message request made');
    res.json({ type: 'message', text: `${req.body}` });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening at localhost:${PORT}`);
});
