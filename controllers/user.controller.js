const UserService = require('../services/user.service');
const HTTP_STATUS_CODE = require('../exceptions/http-status.code');
const logger = require('../services/winston.service');

const defaultPageLimit = 10;

exports.getAutoSuggested = async (req, res) => {
    const limit = getFormattedPageLimitParameter(req.query.limit);
    const loginSubstring = req.query.loginSubstring ? req.query.loginSubstring : '';
    try {
        const users = await UserService.getAutoSuggested(loginSubstring, limit);
        return res.status(HTTP_STATUS_CODE.OK).json(users);
    } catch (e) {
        logger.error({
            method: 'UserController.getAutoSuggested',
            arguments: `Limit: ${limit} | LoginSubstring: ${loginSubstring}`,
            message: e.message
        });
        return res.status(e.statusCode).json({ message: e.message });
    }
};

function getFormattedPageLimitParameter(strLimit) {
    if (strLimit && isStringInteger(strLimit)) {
        return Math.abs(parseInt(strLimit, 10));
    }

    return defaultPageLimit;
}

function isStringInteger(strNumber) {
    return !isNaN(parseInt(strNumber, 10));
}

exports.getById = async (req, res) => {
    try {
        const user = await UserService.getById(req.params.id);
        return res.status(HTTP_STATUS_CODE.OK).json(user);
    } catch (e) {
        logger.error({
            method: 'UserController.getById',
            arguments: `ID: ${req.params.id}`,
            message: e.message
        });
        return res.status(e.statusCode).json({ message: e.message });
    }
};

exports.create = async (req, res) => {
    const newUser = {
        ...req.body,
        is_deleted: false
    };

    try {
        const user = await UserService.create(newUser);
        return res.status(HTTP_STATUS_CODE.CREATED).json(user);
    } catch (e) {
        logger.error({
            method: 'UserController.create',
            arguments: `User: ${JSON.stringify(newUser)}`,
            message: e.message
        });
        return res.status(e.statusCode).json({ message: e.message });
    }
};

exports.update = async (req, res) => {
    const updatedUser = { ...req.body };
    try {
        await UserService.update(req.params.id, updatedUser);
        res.status(HTTP_STATUS_CODE.OK).json({ message: 'User updated successfully!' });
    } catch (e) {
        logger.error({
            method: 'UserController.update',
            arguments: `ID: ${req.params.id} | User: ${JSON.stringify(updatedUser)}`,
            message: e.message
        });
        return res.status(e.statusCode).json({ message: e.message });
    }
};


exports.delete = async (req, res) => {
    try {
        await UserService.delete(req.params.id);
        return res.status(HTTP_STATUS_CODE.OK).json({ message: 'User deleted successfully!' });
    } catch (e) {
        logger.error({
            method: 'UserController.delete',
            arguments: `ID: ${req.params.id}`,
            message: e.message
        });
        return res.status(e.statusCode).json({ message: e.message });
    }
};

