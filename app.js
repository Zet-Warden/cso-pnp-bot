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
    //     return `${prev}\n\n${currProp}: ${rowInfo[currProp]}`;
    // }, '');

    let textInfo =
        '<table style=”padding:250px;width:500px;border:100px white;”> <tr style=”background-color:#c6c6c6"> <th>Number</th><th>Short Description</th></tr>';

    textInfo += Object.keys(rowInfo).reduce((prev, currProp) => {
        return `${prev}<tr><td>${currProp}:</td><td>${rowInfo[currProp]}</td></tr>`;
    }, '');
    // console.log(textInfo);

    // res.json({ type: 'message', textFormat: 'xml', text: `${textInfo}` });
    res.json({
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: {
            $schema: 'http://adaptivecards.io/schemas/adaptive-card.json',
            type: 'AdaptiveCard',
            version: '1.0',
            body: [
                {
                    type: 'Container',
                    items: [
                        {
                            type: 'TextBlock',
                            text: 'Publish Adaptive Card schema',
                            weight: 'bolder',
                            size: 'medium',
                        },
                        {
                            type: 'ColumnSet',
                            columns: [
                                {
                                    type: 'Column',
                                    width: 'auto',
                                    items: [
                                        {
                                            type: 'Image',
                                            url: 'https://pbs.twimg.com/profile_images/3647943215/d7f12830b3c17a5a9e4afcc370e3a37e_400x400.jpeg',
                                            size: 'small',
                                            style: 'person',
                                        },
                                    ],
                                },
                                {
                                    type: 'Column',
                                    width: 'stretch',
                                    items: [
                                        {
                                            type: 'TextBlock',
                                            text: 'Matt Hidinger',
                                            weight: 'bolder',
                                            wrap: true,
                                        },
                                        {
                                            type: 'TextBlock',
                                            spacing: 'none',
                                            text: 'Created {{DATE(2017-02-14T06:08:39Z, SHORT)}}',
                                            isSubtle: true,
                                            wrap: true,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    type: 'Container',
                    items: [
                        {
                            type: 'TextBlock',
                            text: 'Now that we have defined the main rules and features of the format, we need to produce a schema and publish it to GitHub. The schema will be the starting point of our reference documentation.',
                            wrap: true,
                        },
                        {
                            type: 'FactSet',
                            facts: [
                                {
                                    title: 'Board:',
                                    value: 'Adaptive Card',
                                },
                                {
                                    title: 'List:',
                                    value: 'Backlog',
                                },
                                {
                                    title: 'Assigned to:',
                                    value: 'Matt Hidinger',
                                },
                                {
                                    title: 'Due date:',
                                    value: 'Not set',
                                },
                            ],
                        },
                    ],
                },
            ],
            actions: [
                {
                    type: 'Action.ShowCard',
                    title: 'Set due date',
                    card: {
                        type: 'AdaptiveCard',
                        body: [
                            {
                                type: 'Input.Date',
                                id: 'dueDate',
                            },
                        ],
                        actions: [
                            {
                                type: 'Action.Submit',
                                title: 'OK',
                            },
                        ],
                    },
                },
                {
                    type: 'Action.ShowCard',
                    title: 'Comment',
                    card: {
                        type: 'AdaptiveCard',
                        body: [
                            {
                                type: 'Input.Text',
                                id: 'comment',
                                isMultiline: true,
                                placeholder: 'Enter your comment',
                            },
                        ],
                        actions: [
                            {
                                type: 'Action.Submit',
                                title: 'OK',
                            },
                        ],
                    },
                },
            ],
        },
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is listening at localhost:${PORT}`);
});
