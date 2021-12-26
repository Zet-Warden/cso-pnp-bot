const express = require('express');
const app = express();
require('dotenv').config();

const messagesRouter = require('./routes/messages.js');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/messages', messagesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is listening at localhost:${PORT}`);
});
