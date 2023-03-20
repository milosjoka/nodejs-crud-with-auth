const GroupController = require('./group.controller');
const GroupService = require('../services/group.service');
const HTTP_STATUS_CODE = require('../exceptions/http-status.code');
const APIError = require('../exceptions/api.error');

let mockedResponse;
describe('Group controller', () => {
    beforeEach(() => {
        mockedResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    it('should call GroupService.getAll', async () => {
        jest.spyOn(GroupService, 'getAll').mockResolvedValue([]);
        const mockedRequest = {};
        await GroupController.getAll(mockedRequest, mockedResponse);
        expect(mockedResponse.status).toBeCalledWith(HTTP_STATUS_CODE.OK);
        expect(GroupService.getAll).toBeCalled();
    });

    it('should return error on call GroupService.getAll', async () => {
        jest.spyOn(GroupService, 'getAll').mockImplementation(() => {
            throw new APIError('Error while getting groups', HTTP_STATUS_CODE.BAD_REQUEST);
        });
        const mockedRequest = {};
        await GroupController.getAll(mockedRequest, mockedResponse);
        expect(mockedResponse.status).toBeCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
        expect(mockedResponse.json).toBeCalledWith({ message: 'Error while getting groups' });
    });

    it('should return Group with id from params', async () => {
        const mockedGroupRecord = { id: '1', name: 'Test name' };
        jest.spyOn(GroupService, 'getById').mockResolvedValueOnce(mockedGroupRecord);
        const mockedRequest = { params: { id: '1' } };

        await GroupController.getById(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith(mockedGroupRecord);
    });

    it('should return argument error on call GroupController.getById', async () => {
        jest.spyOn(GroupService, 'getById').mockImplementation(() => {
            throw new APIError('Wrong argument value!', HTTP_STATUS_CODE.BAD_REQUEST);
        });
        const mockedRequest = { params: { id: '1' } };

        await GroupController.getById(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith({ message: 'Wrong argument value!' });
    });

    it('should create group', async () => {
        const mockedGroupRecord = { id: '1', name: 'Test name' };
        const mockedRequest = { body: mockedGroupRecord };
        jest.spyOn(GroupService, 'create').mockResolvedValueOnce(mockedGroupRecord);
        await GroupController.create(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith(mockedGroupRecord);
    });

    it('should return error on create group request when group already exists', async () => {
        const mockedGroupRecord = { id: '1', name: 'Test name' };
        const mockedRequest = { body: mockedGroupRecord };
        jest.spyOn(GroupService, 'create').mockImplementation(() => {
            throw new APIError('Cannot create group with name: "Test name", already exists!', HTTP_STATUS_CODE.VALIDATION_ERROR);
        });
        await GroupController.create(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith({ message: 'Cannot create group with name: "Test name", already exists!' });
    });

    it('should update group', async () => {
        const mockedGroupRecord = { id: '1', name: 'Test name' };
        const mockedRequest = { params: { id: '1' }, body: mockedGroupRecord };
        jest.spyOn(GroupService, 'update').mockResolvedValueOnce(mockedGroupRecord);
        await GroupController.update(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith({ message: 'Group updated successfully!' });
    });

    it('should call delete method with id = 1', async () => {
        const mockedRequest = { params: { id: '1' } };
        jest.spyOn(GroupService, 'delete').mockResolvedValueOnce(1);
        await GroupController.delete(mockedRequest, mockedResponse);
        expect(GroupService.delete).toBeCalledWith(mockedRequest.params.id);
    });

    it('should delete group', async () => {
        const mockedRequest = { params: { id: '1' } };
        jest.spyOn(GroupService, 'delete').mockResolvedValueOnce(1);
        await GroupController.delete(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith({ message: 'Group deleted successfully!' });
    });

    it('should add users to group', async () => {
        const mockedRequest = { params: { id: '1' }, body: { userIds: ['fake-user-id-1', 'fake-user-id-2'] } };
        jest.spyOn(GroupService, 'addUsersToGroup').mockImplementation(() => {
        });
        await GroupController.addUsersToGroup(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith({ message: 'Users added successfully!' });
    });

    it('should return error on add users to group request', async () => {
        const mockedRequest = { params: { id: '1' }, body: { userIds: ['fake-user-id-1', 'fake-user-id-2'] } };
        jest.spyOn(GroupService, 'addUsersToGroup').mockImplementation(() => {
            throw new APIError('Cannot add users to group!', HTTP_STATUS_CODE.BAD_REQUEST);
        });
        await GroupController.addUsersToGroup(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith({ message: 'Cannot add users to group!' });
    });
});
