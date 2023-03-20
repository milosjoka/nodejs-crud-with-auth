const HTTP_STATUS_CODE = require('../exceptions/http-status.code');
const jwt = require('jsonwebtoken');
const appConfig = require('../config/app.config');

exports.login = async (req, res) => {
    const user = req.user;
    const payload = { sub: user.id, name: user.name };
    const token = jwt.sign(payload, appConfig.JWT_SECRET, { expiresIn: 300 });
    return res.status(HTTP_STATUS_CODE.OK).json({ token });
};

