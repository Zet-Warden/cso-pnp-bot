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
    //const rowInfo = (await getRowInfo(opaNumber)).info;
    // const textInfo = Object.keys(rowInfo).reduce((prev, currProp) => {
    //     return `${prev}\n\n${currProp}: ${rowInfo[currProp]}`;
    // }, '');

    // let textInfo =
    //     '<table style=”padding:250px;width:500px;border:100px white;”> <tr style=”background-color:#c6c6c6"> <th>Number</th><th>Short Description</th></tr>';

    // textInfo += Object.keys(rowInfo).reduce((prev, currProp) => {
    //     return `${prev}<tr><td>${currProp}:</td><td>${rowInfo[currProp]}</td></tr>`;
    // }, '');
    // console.log(textInfo);

    // res.json({ type: 'message', textFormat: 'xml', text: `${textInfo}` });
    res.json({
        type: 'message',
        attachments: [
            {
                contentType: 'application/vnd.microsoft.card.adaptive',
                contentUrl: null,
                content: {
                    type: 'AdaptiveCard',
                    version: '1.4',
                    body: [
                        {
                            type: 'TextBlock',
                            text: 'Request sent by: ' + receivedMsg.from.name,
                        },
                        {
                            type: 'Image',
                            url: 'https://c.s-microsoft.com/en-us/CMSImages/DesktopContent-04_UPDATED.png?version=43c80870-99dd-7fb1-48c0-59aced085ab6',
                        },
                        {
                            type: 'TextBlock',
                            text: 'Sample image for Adaptive Card.',
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
