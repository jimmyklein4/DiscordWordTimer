exports.getFormattedMessage = lastMessageTime => {
    return ('Time since last cum: ' + Math.floor(lastMessageTime / 86400000) + ' days, ' +
    Math.floor((lastMessageTime % 86400000) / 3600000) + ' hours, ' +
    Math.floor((lastMessageTime % 3600000) / 60000) + ' minutes, ' +
    Math.floor((lastMessageTime % 60000) / 1000) + ' seconds');
};