function createTextMessage(text = '') {
    return {
        type: 'message',
        text,
    };
}

function createHTMLMessage(html = '') {
    return {
        type: 'message',
        textFormat: 'xml',
        text: html,
    };
}

module.exports = {
    createTextMessage,
    createHTMLMessage,
};
