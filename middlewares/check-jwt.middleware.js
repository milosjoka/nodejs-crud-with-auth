const jwt = require('jsonwebtoken');
const HTTP_STATUS_CODE = require('../exceptions/http-status.code');
const appConfig = require('../config/app.config');

function extractBearerTokenFromAuthorizationHeader(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }

    return null;
}

module.exports = (req, res, next) => {
    const token = extractBearerTokenFromAuthorizationHeader(req);

    if (!token) {
        return res.status(HTTP_STATUS_CODE.NOT_AUTHORIZED).json({ message: 'Unauthorized!' });
    }

    return jwt.verify(token, appConfig.JWT_SECRET, (error) => {
        if (error) {
            return res.status(HTTP_STATUS_CODE.FORBIDDEN).json({ message: 'Forbidden access!' });
        }
        return next();
    });
};

