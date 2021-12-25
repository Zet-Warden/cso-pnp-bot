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
    // const textInfo = Object.keys(rowInfo).reduce((prev, currProp) => {
    //     return `${prev}\n\n${currProp}:&#09;&#09;&#09;${rowInfo[currProp]}`;
    // }, '');

    // let textInfo =
    //     '<table style=”padding:250px;width:500px;border:100px white;”> <tr style=”background-color:#c6c6c6"> <th>Number</th><th>Short Description</th></tr>';

    // textInfo += Object.keys(rowInfo).reduce((prev, currProp) => {
    //     return `${prev}<tr><td>${currProp}:</td><td>${rowInfo[currProp]}</td></tr>`;
    // }, '');
    // console.log(textInfo);

    // res.json({ type: 'message', textFormat: 'xml', text: `${textInfo}` });

    const columnOne = {
        type: 'Column',
        items: Object.keys(rowInfo).map((key) => {
            return {
                type: 'TextBlock',
                width: 'auto',
                minHeight: '180px',
                separator: true,
                text: key,
            };
        }),
    };

    const columnTwo = {
        type: 'Column',
        items: Object.keys(rowInfo).map((key) => {
            return {
                type: 'TextBlock',
                width: '350px',
                minHeight: '180px',
                wrap: rowInfo[key].includes('Email sent at'),
                separator: true,
                text:
                    (rowInfo[key].includes('https')
                        ? `[Link](${rowInfo[key]})`
                        : rowInfo[key]) || 'N/A',
            };
        }),
    };

    const columns = [columnOne, columnTwo];

    res.json({
        type: 'message',
        attachments: [
            {
                contentType: 'application/vnd.microsoft.card.adaptive',
                contentUrl: null,
                content: {
                    type: 'AdaptiveCard',
                    version: '1.5',
                    body: [
                        {
                            type: 'ColumnSet',
                            columns: columns,
                        },
                    ],
                },
                name: null,
                thumbnailUrl: null,
            },
        ],
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening at localhost:${PORT}`);
});
