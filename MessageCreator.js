function createMessage({ type = 'message', textFormat = '', text = '' }) {
    return {
        type,
        textFormat,
        text,
    };
}

module.exports = {
    createMessage,
};
