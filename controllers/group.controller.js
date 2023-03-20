const GroupService = require('../services/group.service');
const HTTP_STATUS_CODE = require('../exceptions/http-status.code');
const logger = require('../services/winston.service');

exports.getAll = async (req, res) => {
    try {
        const groups = await GroupService.getAll();
        return res.status(HTTP_STATUS_CODE.OK).json(groups);
    } catch (e) {
        logger.error({
            method: 'GroupController.getAll',
            arguments: '',
            message: e.message
        });
        return res.status(e.statusCode).json({ message: e.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const group = await GroupService.getById(req.params.id);
        return res.status(HTTP_STATUS_CODE.OK).json(group);
    } catch (e) {
        logger.error({
            method: 'GroupController.getById',
            arguments: `ID: ${req.params.id}`,
            message: e.message
        });
        return res.status(e.statusCode).json({ message: e.message });
    }
};

exports.create = async (req, res) => {
    const newGroup = {
        ...req.body
    };

    try {
        const group = await GroupService.create(newGroup);
        return res.status(HTTP_STATUS_CODE.CREATED).json(group);
    } catch (e) {
        logger.error({
            method: 'GroupController.create',
            arguments: `Group: ${JSON.stringify(newGroup)}`,
            message: e.message
        });
        return res.status(e.statusCode).json({ message: e.message });
    }
};

exports.update = async (req, res) => {
    const updatedGroup = { ...req.body };
    try {
        await GroupService.update(req.params.id, updatedGroup);
        res.status(HTTP_STATUS_CODE.OK).json({ message: 'Group updated successfully!' });
    } catch (e) {
        logger.error({
            method: 'GroupController.update',
            arguments: `ID: ${req.params.id}  |  Group: ${JSON.stringify(updatedGroup)}`,
            message: e.message
        });
        return res.status(e.statusCode).json({ message: e.message });
    }
};

exports.delete = async (req, res) => {
    try {
        await GroupService.delete(req.params.id);
        return res.status(HTTP_STATUS_CODE.OK).json({ message: 'Group deleted successfully!' });
    } catch (e) {
        logger.error({
            method: 'GroupController.delete',
            arguments: `ID: ${req.params.id}`,
            message: e.message
        });
        return res.status(e.statusCode).json({ message: e.message });
    }
};

exports.addUsersToGroup = async (req, res) => {
    try {
        await GroupService.addUsersToGroup(req.params.id, req.body.userIds);
        res.status(HTTP_STATUS_CODE.OK).json({ message: 'Users added successfully!' });
    } catch (e) {
        logger.error({
            method: 'GroupController.addUsersToGroup',
            arguments: `ID: ${req.params.id} |  UserIds: ${req.body.userIds}`,
            message: e.message
        });
        return res.status(e.statusCode).json({ message: e.message });
    }
};

