const Joi = require('joi');
const express = require('express');
const validator = require('express-joi-validation').createValidator({});
const GroupController = require('../../controllers/group.controller');

const router = express.Router();

router.get('/', GroupController.getAll);

router.get('/:id', GroupController.getById);

const validationSchema = Joi.object({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string().valid(
        'READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'
    )).unique().required()
});

const addUsersToGroupValidationSchema = Joi.object({
    userIds: Joi.array().items(Joi.string()).required()
});


router.post('/', validator.body(validationSchema, { joi: { convert: true, allowUnknown: false } }), GroupController.create);

router.put('/:id/users', validator.body(addUsersToGroupValidationSchema, { joi: { convert: true, allowUnknown: false } }), GroupController.addUsersToGroup);

router.put('/:id', validator.body(validationSchema, { joi: { convert: true, allowUnknown: false } }), GroupController.update);

router.delete('/:id', GroupController.delete);


module.exports = router;
