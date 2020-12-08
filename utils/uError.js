module.exports = (statusCode = 500, errorCode = "SERVER_ERROR", data = []) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.errorCode = errorCode.toUpperCase().replace(/\s/g, "_"); //ERROR_CODE
    error.data = data;
    throw error;
};
