const UserController = require('./user.controller');
const UserService = require('../services/user.service');
const HTTP_STATUS_CODE = require('../exceptions/http-status.code');
const APIError = require('../exceptions/api.error');

let mockedResponse;

describe('UserController', () => {
    beforeEach(() => {
        mockedResponse = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });

    it('should call UserController.getAutoSuggested', async () => {
        jest.spyOn(UserService, 'getAutoSuggested').mockResolvedValue([]);
        const mockedRequest = { query: { limit: 5, loginSubstring: 'fake-search' } };
        await UserController.getAutoSuggested(mockedRequest, mockedResponse);
        expect(UserService.getAutoSuggested).toBeCalled();
        expect(mockedResponse.json).toBeCalledWith([]);
        expect(mockedResponse.status).toBeCalledWith(HTTP_STATUS_CODE.OK);
    });

    it('should return error on call UserController.getAutoSuggested when DB is not online', async () => {
        jest.spyOn(UserService, 'getAutoSuggested').mockImplementation(() => {
            throw new APIError('Error while getting auto-suggested users', HTTP_STATUS_CODE.BAD_REQUEST);
        });
        const mockedRequest = { query: { limit: 5, loginSubstring: 'fake-search' } };
        await UserController.getAutoSuggested(mockedRequest, mockedResponse);
        expect(mockedResponse.status).toBeCalledWith(HTTP_STATUS_CODE.BAD_REQUEST);
        expect(mockedResponse.json).toBeCalledWith({ message: 'Error while getting auto-suggested users' });
    });

    it('should return User with id from params', async () => {
        const mockedUserRecord = {
            id: 'test-id',
            login: 'milos@epam.com',
            age: 20,
            is_deleted: false,
            groups: []
        };
        jest.spyOn(UserService, 'getById').mockResolvedValueOnce(mockedUserRecord);
        const mockedRequest = { params: { id: 'test-id' } };

        await UserController.getById(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith(mockedUserRecord);
    });

    it('should return argument error on call UserController.getById when ID has wrong value', async () => {
        jest.spyOn(UserService, 'getById').mockImplementation(() => {
            throw new APIError('Wrong argument value!', HTTP_STATUS_CODE.BAD_REQUEST);
        });
        const mockedRequest = { params: { id: 'test-id' } };

        await UserController.getById(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith({ message: 'Wrong argument value!' });
    });

    it('should create user', async () => {
        const mockedUserRecord = {
            login: 'fake-user@epam.com',
            password: 'fake123password321',
            age: 20
        };
        const mockedRequest = { body: mockedUserRecord };

        jest.spyOn(UserService, 'create').mockResolvedValueOnce(mockedUserRecord);
        await UserController.create(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith(mockedUserRecord);
    });

    it('should return error on create user request when already exists', async () => {
        const mockedUserRecord = {
            login: 'fake-user@epam.com',
            password: 'fake123password321',
            age: 20
        };
        const mockedRequest = { body: mockedUserRecord };

        jest.spyOn(UserService, 'create').mockImplementation(() => {
            throw new APIError(`Cannot create user with login: '${mockedUserRecord.login}', already exists!`, HTTP_STATUS_CODE.VALIDATION_ERROR);
        });
        await UserController.create(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith({ message: `Cannot create user with login: '${mockedUserRecord.login}', already exists!` });
    });

    it('should update user', async () => {
        const mockedUserRecord = {
            id: 'fake-id',
            login: 'fake-user@epam.com',
            password: 'fake123password321',
            age: 20
        };
        const mockedRequest = { params: { id: 'fake-id' }, body: mockedUserRecord };
        jest.spyOn(UserService, 'update').mockResolvedValueOnce(mockedUserRecord);
        await UserController.update(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith({ message: 'User updated successfully!' });
    });

    it('should return error on update user request when login value already exists', async () => {
        const mockedUserRecord = {
            id: 'fake-id',
            login: 'fake-user@epam.com',
            password: 'fake123password321',
            age: 20
        };
        const mockedRequest = { params: { id: 'fake-id' }, body: mockedUserRecord };
        jest.spyOn(UserService, 'update').mockImplementation(() => {
            throw new APIError(`Cannot update user with login: '${mockedUserRecord.login}'!`, HTTP_STATUS_CODE.VALIDATION_ERROR);
        });
        await UserController.update(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith({ message: `Cannot update user with login: '${mockedUserRecord.login}'!` });
    });

    it('should delete user', async () => {
        const mockedRequest = { params: { id: 'fake-id' } };
        jest.spyOn(UserService, 'delete').mockResolvedValueOnce(1);
        await UserController.delete(mockedRequest, mockedResponse);
        expect(mockedResponse.json).toBeCalledWith({ message: 'User deleted successfully!' });
    });

    it('should respond with 409 status error, on delete request when user is not found', async () => {
        const mockedRequest = { params: { id: 'fake-id' } };
        jest.spyOn(UserService, 'delete').mockImplementation(() => {
            throw new APIError(`Cannot delete user with id: '${mockedRequest.params.id}', user not found!`, HTTP_STATUS_CODE.VALIDATION_ERROR);
        });
        await UserController.delete(mockedRequest, mockedResponse);
        expect(mockedResponse.status).toBeCalledWith(HTTP_STATUS_CODE.VALIDATION_ERROR);
        expect(mockedResponse.json).toBeCalledWith({ message: `Cannot delete user with id: '${mockedRequest.params.id}', user not found!` });
    });
});
