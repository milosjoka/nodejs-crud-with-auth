const UserRepository = require('../data-access/user.repository');
const APIError = require('../exceptions/api.error');
const HTTP_STATUS_CODE = require('../exceptions/http-status.code');
const logger = require('./winston.service');
const bcryptConfig = require('../config/bcrypt.config');

exports.getAutoSuggested = async (loginSubstring, limit) => {
    return await UserRepository.getAutoSuggested(loginSubstring, limit)
        .catch((error) => {
            logger.error({
                status: HTTP_STATUS_CODE.BAD_REQUEST,
                message: 'Error while getting auto-suggested users',
                stack: error.stack
            });
            throw new APIError('Error while getting auto-suggested users', HTTP_STATUS_CODE.BAD_REQUEST);
        });
};

exports.getById = async (id) => {
    const user = await UserRepository.getById(id).catch((error) => {
        logger.error({
            status: HTTP_STATUS_CODE.BAD_REQUEST,
            message: 'Get user by ID, Wrong argument value!',
            stack: error.stack
        });
        throw new APIError('Wrong argument value!', HTTP_STATUS_CODE.BAD_REQUEST);
    });
    if (user === null) {
        logger.error({
            status: HTTP_STATUS_CODE.NOT_FOUND,
            message: `User with the id  '${id}' not found!`,
            stack: ''
        });
        throw new APIError(`User with the id  '${id}' not found!`, HTTP_STATUS_CODE.NOT_FOUND);
    }

    return user;
};

exports.create = async (user) => {
    const userWithHashedPassword = await getUserWithHashedPassword(user);

    return await UserRepository.create(userWithHashedPassword).catch((error) => {
        logger.error({
            status: HTTP_STATUS_CODE.VALIDATION_ERROR,
            message: `Cannot create user with login: '${user.login}', already exists!`,
            stack: error.stack
        });
        throw new APIError(`Cannot create user with login: '${user.login}', already exists!`, HTTP_STATUS_CODE.VALIDATION_ERROR);
    });
};

async function getUserWithHashedPassword(user) {
    return {
        ...user,
        password: await bcryptConfig.hash(user.password)
    };
}

exports.update = async (id, user) => {
    const userWithHashedPassword = await getUserWithHashedPassword(user);

    const [updatedRows] = await UserRepository.update(id, userWithHashedPassword)
        .catch((error) => {
            logger.error({
                status: HTTP_STATUS_CODE.VALIDATION_ERROR,
                message: `Cannot update user with login: '${user.login}'!`,
                stack: error.stack
            });
            throw new APIError(`Cannot update user with login: '${user.login}'!`, HTTP_STATUS_CODE.VALIDATION_ERROR);
        });

    if (updatedRows !== 1) {
        logger.error({
            status: HTTP_STATUS_CODE.NOT_FOUND,
            message: `Cannot update user with id: '${id}', user not found!`,
            stack: ''
        });
        throw new APIError(`Cannot update user with id: '${id}', user not found!`, HTTP_STATUS_CODE.NOT_FOUND);
    }
    return updatedRows;
};

exports.delete = async (id) => {
    const deletedRows = await UserRepository.delete(id)
        .catch((error) => {
            logger.error({
                status: HTTP_STATUS_CODE.VALIDATION_ERROR,
                message: `Cannot delete user with id: '${id}'!`,
                stack: error.stack
            });
            throw new APIError(`Cannot delete user with id: '${id}'!`, HTTP_STATUS_CODE.VALIDATION_ERROR);
        });

    if (deletedRows !== 1) {
        logger.error({
            status: HTTP_STATUS_CODE.VALIDATION_ERROR,
            message: `Cannot delete user with id: '${id}', user not found!`,
            stack: ''
        });
        throw new APIError(`Cannot delete user with id: '${id}', user not found!`, HTTP_STATUS_CODE.NOT_FOUND);
    }

    return deletedRows;
};

exports.getByLogin = async (login) => {
    const user = await UserRepository.getByLogin(login).catch((error) => {
        logger.error({
            status: HTTP_STATUS_CODE.BAD_REQUEST,
            message: 'Get user by credentials, Wrong credentials!',
            stack: error.stack
        });
        throw new APIError('Wrong credentials!', HTTP_STATUS_CODE.BAD_REQUEST);
    });
    if (user === null) {
        logger.error({
            status: HTTP_STATUS_CODE.NOT_FOUND,
            message: `User with the login  '${login}' not found!`,
            stack: ''
        });
        throw new APIError(`User with the login  '${login}' not found!`, HTTP_STATUS_CODE.NOT_FOUND);
    }

    return user;
};
