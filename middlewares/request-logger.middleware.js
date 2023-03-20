const morgan = require('morgan');

morgan.token('custom-request-logger', (req) => {
    return JSON.stringify({
        url: req.baseUrl,
        method: req.method,
        body: req.body,
        query: req.query,
        params: req.params
    });
}
);

module.exports = morgan;
