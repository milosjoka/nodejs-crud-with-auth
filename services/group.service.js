const GroupRepository = require('../data-access/group.repository');
const APIError = require('../exceptions/api.error');
const HTTP_STATUS_CODE = require('../exceptions/http-status.code');
const logger = require('./winston.service');

exports.getAll = async () => {
    return await GroupRepository.getAll()
        .catch((error) => {
            logger.error({
                status: HTTP_STATUS_CODE.BAD_REQUEST,
                message: 'Error while getting groups',
                stack: error.stack
            });
            throw new APIError('Error while getting groups', HTTP_STATUS_CODE.BAD_REQUEST);
        });
};

exports.getById = async (id) => {
    const group = await GroupRepository.getById(id).catch((error) => {
        logger.error({
            status: HTTP_STATUS_CODE.BAD_REQUEST,
            message: 'Wrong argument value!',
            stack: error.stack
        });
        throw new APIError('Wrong argument value!', HTTP_STATUS_CODE.BAD_REQUEST);
    });
    if (group === null) {
        logger.error({
            status: HTTP_STATUS_CODE.NOT_FOUND,
            message: `Group with the id  '${id}' not found!`,
            stack: ''
        });
        throw new APIError(`Group with the id  '${id}' not found!`, HTTP_STATUS_CODE.NOT_FOUND);
    }

    return group;
};

exports.create = async (group) => {
    return await GroupRepository.create(group).catch((error) => {
        logger.error({
            status: HTTP_STATUS_CODE.VALIDATION_ERROR,
            message: `Cannot create group with name: '${group.name}', already exists!`,
            stack: error.stack
        });
        throw new APIError(`Cannot create group with name: '${group.name}', already exists!`, HTTP_STATUS_CODE.VALIDATION_ERROR);
    });
};

exports.update = async (id, group) => {
    const [updatedRows] = await GroupRepository.update(id, group)
        .catch((error) => {
            logger.error({
                status: HTTP_STATUS_CODE.VALIDATION_ERROR,
                message: `Cannot update group with name: '${group.name}'!`,
                stack: error.stack
            });
            throw new APIError(`Cannot update group with name: '${group.name}'!`, HTTP_STATUS_CODE.VALIDATION_ERROR);
        });

    if (updatedRows !== 1) {
        logger.error({
            status: HTTP_STATUS_CODE.NOT_FOUND,
            message: `Cannot update group with id: '${id}', group not found!`,
            stack: ''
        });
        throw new APIError(`Cannot update group with id: '${id}', group not found!`, HTTP_STATUS_CODE.NOT_FOUND);
    }
    return updatedRows;
};

exports.addUsersToGroup = async (id, userIds) => {
    return await GroupRepository.addUsersToGroup(id, userIds)
        .catch((error) => {
            logger.error({
                status: HTTP_STATUS_CODE.BAD_REQUEST,
                message: 'Cannot add users to group!',
                stack: error.stack
            });
            throw new APIError('Cannot add users to group!', HTTP_STATUS_CODE.BAD_REQUEST);
        });
};

exports.delete = async (id) => {
    const deletedRows = await GroupRepository.delete(id)
        .catch((error) => {
            logger.error({
                status: HTTP_STATUS_CODE.BAD_REQUEST,
                message: `Cannot delete group with id: '${id}'!`,
                stack: error.stack
            });
            throw new APIError(`Cannot delete group with id: '${id}'!`, HTTP_STATUS_CODE.BAD_REQUEST);
        });


    if (deletedRows !== 1) {
        logger.error({
            status: HTTP_STATUS_CODE.NOT_FOUND,
            message: `Cannot delete group with id: '${id}', group not found!`,
            stack: ''
        });
        throw new APIError(`Cannot delete group with id: '${id}', group not found!`, HTTP_STATUS_CODE.NOT_FOUND);
    }

    return deletedRows;
};
