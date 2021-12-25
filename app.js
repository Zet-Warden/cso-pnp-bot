const crypto = require('crypto');
const express = require('express');
const app = express();
const { getRowInfo } = require('./sheets.js');
require('dotenv').config();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/messages/api', async (req, res) => {
    const { from, text } = req.body;
    const username = from.name;

    const [, , opaNumber] = text.trim().split(' ');
    // console.log(opaNumber);
    const rowInfo = (await getRowInfo(opaNumber)).info;
    const textInfo = Object.keys(rowInfo).reduce((prev, currProp) => {
        return `${prev}\n${currProp}: ${rowInfo[currProp]}`;
    }, '');
    // console.log(textInfo);
    res.json({ type: 'message', text: `${textInfo}` });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening at localhost:${PORT}`);
});
