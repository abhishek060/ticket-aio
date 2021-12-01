module.exports = {
    apiResponse
};

function apiResponse(message, status, data = []) {
    let messageObj = {
        "param": "",
        "msg": message
    };
    let messages = [messageObj];
    return responseObj = {
        message: message,
        data: data,
        status: status
    };
}