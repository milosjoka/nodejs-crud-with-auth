const logger = require('../services/winston.service');

const logErrors = (err, req, res, next) => {
    logger.error({
        status: err.status || 500,
        message: err.message || 'Error on the server side!',
        stack: err.stack
    });
    next(err);
};

module.exports = logErrors;
